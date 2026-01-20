import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// GET all organization types
router.get('/types', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT * FROM organization_types 
      WHERE is_active = TRUE 
      ORDER BY type_id
    `);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching organization types:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET all organizations (with optional type filter)
router.get('/', async (req, res) => {
  try {
    const { type_id, type_code } = req.query;
    
    let query = `
      SELECT o.*, ot.type_name, ot.type_code
      FROM organizations o
      JOIN organization_types ot ON o.type_id = ot.type_id
      WHERE o.is_active = TRUE
    `;
    const params = [];

    if (type_id) {
      query += ' AND o.type_id = ?';
      params.push(type_id);
    }
    if (type_code) {
      query += ' AND ot.type_code = ?';
      params.push(type_code);
    }

    query += ' ORDER BY o.name';

    const [rows] = await pool.query(query, params);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching organizations:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET external partners (type_id = 1)
router.get('/external', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        organization_id AS partner_id,
        name AS partner_name,
        sub_type AS partner_type,
        industry_sector,
        contact_person,
        contact_email,
        contact_phone,
        website,
        is_active
      FROM organizations 
      WHERE type_id = 1 AND is_active = TRUE 
      ORDER BY name
    `);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching external partners:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET placement partners (type_id = 2)
router.get('/placement', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        organization_id AS placement_partner_id,
        name AS partner_name,
        industry_sector,
        sub_type AS placement_type,
        contact_person,
        contact_email,
        contact_phone,
        is_active
      FROM organizations 
      WHERE type_id = 2 AND is_active = TRUE 
      ORDER BY name
    `);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching placement partners:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET student associations (type_id = 3)
router.get('/associations', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        organization_id AS association_id,
        name AS association_name,
        code AS association_code,
        description,
        is_active
      FROM organizations 
      WHERE type_id = 3 AND is_active = TRUE 
      ORDER BY name
    `);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching student associations:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET organization by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(`
      SELECT o.*, ot.type_name, ot.type_code
      FROM organizations o
      JOIN organization_types ot ON o.type_id = ot.type_id
      WHERE o.organization_id = ?
    `, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Organization not found' });
    }
    
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error fetching organization:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// CREATE new organization
router.post('/', async (req, res) => {
  try {
    const { 
      type_id, name, code, industry_sector, sub_type,
      contact_person, contact_email, contact_phone, website, description 
    } = req.body;

    const [result] = await pool.query(`
      INSERT INTO organizations 
      (type_id, name, code, industry_sector, sub_type, contact_person, contact_email, contact_phone, website, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [type_id, name, code, industry_sector, sub_type, contact_person, contact_email, contact_phone, website, description]);

    res.json({ 
      success: true, 
      data: { organization_id: result.insertId },
      message: 'Organization created successfully' 
    });
  } catch (error) {
    console.error('Error creating organization:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// CREATE external partner (convenience endpoint)
router.post('/external', async (req, res) => {
  try {
    const { partner_name, partner_type, contact_email, contact_phone, website, address } = req.body;

    const [result] = await pool.query(`
      INSERT INTO organizations 
      (type_id, name, sub_type, contact_email, contact_phone, website, description)
      VALUES (1, ?, ?, ?, ?, ?, ?)
    `, [partner_name, partner_type || 'company', contact_email, contact_phone, website, address]);

    res.json({ 
      success: true, 
      data: { partner_id: result.insertId },
      message: 'External partner created successfully' 
    });
  } catch (error) {
    console.error('Error creating external partner:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// CREATE placement partner (convenience endpoint)
router.post('/placement', async (req, res) => {
  try {
    const { partner_name, industry_sector, placement_type, contact_person, contact_email, contact_phone } = req.body;

    const [result] = await pool.query(`
      INSERT INTO organizations 
      (type_id, name, industry_sector, sub_type, contact_person, contact_email, contact_phone)
      VALUES (2, ?, ?, ?, ?, ?, ?)
    `, [partner_name, industry_sector, placement_type || 'exposure', contact_person, contact_email, contact_phone]);

    res.json({ 
      success: true, 
      data: { placement_partner_id: result.insertId },
      message: 'Placement partner created successfully' 
    });
  } catch (error) {
    console.error('Error creating placement partner:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// CREATE student association (convenience endpoint)
router.post('/associations', async (req, res) => {
  try {
    const { association_name, association_code, description } = req.body;

    const [result] = await pool.query(`
      INSERT INTO organizations 
      (type_id, name, code, description)
      VALUES (3, ?, ?, ?)
    `, [association_name, association_code, description]);

    res.json({ 
      success: true, 
      data: { association_id: result.insertId },
      message: 'Student association created successfully' 
    });
  } catch (error) {
    console.error('Error creating student association:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// UPDATE organization
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name, code, industry_sector, sub_type,
      contact_person, contact_email, contact_phone, website, description, is_active 
    } = req.body;

    await pool.query(`
      UPDATE organizations SET
        name = COALESCE(?, name),
        code = COALESCE(?, code),
        industry_sector = COALESCE(?, industry_sector),
        sub_type = COALESCE(?, sub_type),
        contact_person = COALESCE(?, contact_person),
        contact_email = COALESCE(?, contact_email),
        contact_phone = COALESCE(?, contact_phone),
        website = COALESCE(?, website),
        description = COALESCE(?, description),
        is_active = COALESCE(?, is_active)
      WHERE organization_id = ?
    `, [name, code, industry_sector, sub_type, contact_person, contact_email, contact_phone, website, description, is_active, id]);

    res.json({ success: true, message: 'Organization updated successfully' });
  } catch (error) {
    console.error('Error updating organization:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE organization (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('UPDATE organizations SET is_active = FALSE WHERE organization_id = ?', [id]);
    res.json({ success: true, message: 'Organization deleted successfully' });
  } catch (error) {
    console.error('Error deleting organization:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
