import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// GET all programs (with optional filters)
router.get('/', async (req, res) => {
  try {
    const { center_id, program_type, status } = req.query;
    
    let query = `
      SELECT 
        p.program_id, p.module_name, p.description,
        p.duration_min_hours, p.duration_max_hours, p.status,
        c.center_id, c.center_name, c.center_code, c.icon,
        pt.program_type_id, pt.type_name, pt.type_code,
        p.created_at, p.updated_at
      FROM programs p
      JOIN centers c ON p.center_id = c.center_id
      JOIN program_types pt ON p.program_type_id = pt.program_type_id
      WHERE 1=1
    `;
    const params = [];

    if (center_id) {
      query += ' AND p.center_id = ?';
      params.push(center_id);
    }
    if (program_type) {
      query += ' AND pt.type_code = ?';
      params.push(program_type);
    }
    if (status) {
      query += ' AND p.status = ?';
      params.push(status);
    }

    query += ' ORDER BY pt.display_order, p.created_at DESC';

    const [rows] = await pool.query(query, params);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching programs:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET programs by center with full details
router.get('/center/:centerId', async (req, res) => {
  try {
    const { centerId } = req.params;

    // Get all programs for the center
    const [programs] = await pool.query(`
      SELECT 
        p.program_id, p.module_name, p.description,
        p.duration_min_hours, p.duration_max_hours, p.status,
        pt.type_name, pt.type_code
      FROM programs p
      JOIN program_types pt ON p.program_type_id = pt.program_type_id
      WHERE p.center_id = ?
      ORDER BY pt.display_order, p.created_at
    `, [centerId]);

    // Get partners, placements, and associations for each program from normalized organizations table
    for (let program of programs) {
      // External partners (type_id = 1)
      const [partners] = await pool.query(`
        SELECT o.organization_id as partner_id, o.name as partner_name, ot.type_name as partner_type
        FROM program_organizations po
        JOIN organizations o ON po.organization_id = o.organization_id
        JOIN organization_types ot ON o.type_id = ot.type_id
        WHERE po.program_id = ? AND o.type_id = 1
      `, [program.program_id]);
      program.partners = partners;

      // Placement partners (type_id = 2)
      const [placements] = await pool.query(`
        SELECT o.organization_id as partner_id, o.name as partner_name, ot.type_name as partner_type
        FROM program_organizations po
        JOIN organizations o ON po.organization_id = o.organization_id
        JOIN organization_types ot ON o.type_id = ot.type_id
        WHERE po.program_id = ? AND o.type_id = 2
      `, [program.program_id]);
      program.placements = placements;

      // Student associations (type_id = 3)
      const [associations] = await pool.query(`
        SELECT o.organization_id as association_id, o.name as association_name, ot.type_name as association_type
        FROM program_organizations po
        JOIN organizations o ON po.organization_id = o.organization_id
        JOIN organization_types ot ON o.type_id = ot.type_id
        WHERE po.program_id = ? AND o.type_id = 3
      `, [program.program_id]);
      program.associations = associations;

      // Cross center request (if applicable)
      if (program.type_code === 'CROSS_CENTER') {
        const [crossCenter] = await pool.query(`
          SELECT c.center_id, c.center_name, ccr.request_status
          FROM cross_center_requests ccr
          JOIN centers c ON ccr.requesting_center_id = c.center_id
          WHERE ccr.program_id = ?
        `, [program.program_id]);
        program.crossCenterRequest = crossCenter[0] || null;
      }
    }

    // Group by program type
    const grouped = {
      advanced: programs.filter(p => p.type_code === 'ADVANCED'),
      steam: programs.filter(p => p.type_code === 'STEAM'),
      crossCenter: programs.filter(p => p.type_code === 'CROSS_CENTER')
    };

    res.json({ success: true, data: grouped });
  } catch (error) {
    console.error('Error fetching center programs:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET single program by ID
router.get('/:id', async (req, res) => {
  try {
    const [program] = await pool.query(`
      SELECT p.*, c.center_name, pt.type_name, pt.type_code
      FROM programs p
      JOIN centers c ON p.center_id = c.center_id
      JOIN program_types pt ON p.program_type_id = pt.program_type_id
      WHERE p.program_id = ?
    `, [req.params.id]);

    if (program.length === 0) {
      return res.status(404).json({ success: false, message: 'Program not found' });
    }

    res.json({ success: true, data: program[0] });
  } catch (error) {
    console.error('Error fetching program:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST create new program
router.post('/', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const {
      center_id, program_type_id, module_name, description,
      duration_min_hours, duration_max_hours,
      partners = [], placements = [], associations = [],
      cross_center_id, created_by
    } = req.body;

    // Insert program
    const [result] = await connection.query(`
      INSERT INTO programs 
        (center_id, program_type_id, module_name, description, 
         duration_min_hours, duration_max_hours, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [center_id, program_type_id, module_name, description,
        duration_min_hours, duration_max_hours, created_by]);

    const programId = result.insertId;

    // Insert partners (organization IDs) into program_organizations
    for (const partnerId of partners) {
      await connection.query(
        'INSERT INTO program_organizations (program_id, organization_id) VALUES (?, ?)',
        [programId, partnerId]
      );
    }

    // Insert placements (organization IDs) into program_organizations
    for (const placementId of placements) {
      await connection.query(
        'INSERT INTO program_organizations (program_id, organization_id) VALUES (?, ?)',
        [programId, placementId]
      );
    }

    // Insert associations (organization IDs) into program_organizations
    for (const associationId of associations) {
      await connection.query(
        'INSERT INTO program_organizations (program_id, organization_id) VALUES (?, ?)',
        [programId, associationId]
      );
    }

    // Insert cross center request if applicable
    if (cross_center_id) {
      await connection.query(
        'INSERT INTO cross_center_requests (program_id, requesting_center_id) VALUES (?, ?)',
        [programId, cross_center_id]
      );
    }

    await connection.commit();
    res.status(201).json({ 
      success: true, 
      message: 'Program created successfully',
      data: { program_id: programId }
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error creating program:', error);
    res.status(500).json({ success: false, message: error.message });
  } finally {
    connection.release();
  }
});

// PUT update program
router.put('/:id', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { id } = req.params;
    const {
      module_name, description, duration_min_hours, duration_max_hours,
      partners = [], placements = [], associations = [], cross_center_id, status
    } = req.body;

    // Update program (include status if provided)
    if (status) {
      await connection.query(`
        UPDATE programs SET
          module_name = COALESCE(?, module_name), 
          description = COALESCE(?, description),
          duration_min_hours = COALESCE(?, duration_min_hours), 
          duration_max_hours = COALESCE(?, duration_max_hours),
          status = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE program_id = ?
      `, [module_name, description, duration_min_hours, duration_max_hours, status, id]);
    } else {
      await connection.query(`
        UPDATE programs SET
          module_name = ?, description = ?,
          duration_min_hours = ?, duration_max_hours = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE program_id = ?
      `, [module_name, description, duration_min_hours, duration_max_hours, id]);
    }

    // Clear and re-insert all organizations (partners, placements, associations)
    await connection.query('DELETE FROM program_organizations WHERE program_id = ?', [id]);
    
    // Insert partners (organization IDs)
    for (const partnerId of partners) {
      await connection.query(
        'INSERT INTO program_organizations (program_id, organization_id) VALUES (?, ?)',
        [id, partnerId]
      );
    }

    // Insert placements (organization IDs)
    for (const placementId of placements) {
      await connection.query(
        'INSERT INTO program_organizations (program_id, organization_id) VALUES (?, ?)',
        [id, placementId]
      );
    }

    // Insert associations (organization IDs)
    for (const associationId of associations) {
      await connection.query(
        'INSERT INTO program_organizations (program_id, organization_id) VALUES (?, ?)',
        [id, associationId]
      );
    }

    // Update cross center request
    await connection.query('DELETE FROM cross_center_requests WHERE program_id = ?', [id]);
    if (cross_center_id) {
      await connection.query(
        'INSERT INTO cross_center_requests (program_id, requesting_center_id) VALUES (?, ?)',
        [id, cross_center_id]
      );
    }

    await connection.commit();
    res.json({ success: true, message: 'Program updated successfully' });
  } catch (error) {
    await connection.rollback();
    console.error('Error updating program:', error);
    res.status(500).json({ success: false, message: error.message });
  } finally {
    connection.release();
  }
});

// DELETE program
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM programs WHERE program_id = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Program not found' });
    }

    res.json({ success: true, message: 'Program deleted successfully' });
  } catch (error) {
    console.error('Error deleting program:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET program types
router.get('/types/all', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM program_types ORDER BY display_order'
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching program types:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
