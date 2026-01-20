import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// GET all submissions
router.get('/', async (req, res) => {
  try {
    const { center_id, status } = req.query;
    
    let query = `
      SELECT 
        ps.*, c.center_name, c.icon,
        u.first_name, u.last_name, u.email
      FROM program_submissions ps
      JOIN centers c ON ps.center_id = c.center_id
      JOIN users u ON ps.submitted_by = u.user_id
      WHERE 1=1
    `;
    const params = [];

    if (center_id) {
      query += ' AND ps.center_id = ?';
      params.push(center_id);
    }
    if (status) {
      query += ' AND ps.submission_status = ?';
      params.push(status);
    }

    query += ' ORDER BY ps.submission_date DESC';

    const [rows] = await pool.query(query, params);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET submission by ID with programs
router.get('/:id', async (req, res) => {
  try {
    const [submission] = await pool.query(`
      SELECT ps.*, c.center_name, c.icon
      FROM program_submissions ps
      JOIN centers c ON ps.center_id = c.center_id
      WHERE ps.submission_id = ?
    `, [req.params.id]);

    if (submission.length === 0) {
      return res.status(404).json({ success: false, message: 'Submission not found' });
    }

    // Get programs in this submission
    const [programs] = await pool.query(`
      SELECT p.*, pt.type_name, pt.type_code
      FROM submission_programs sp
      JOIN programs p ON sp.program_id = p.program_id
      JOIN program_types pt ON p.program_type_id = pt.program_type_id
      WHERE sp.submission_id = ?
      ORDER BY pt.display_order
    `, [req.params.id]);

    // Get notes
    const [notes] = await pool.query(`
      SELECT * FROM submission_notes WHERE submission_id = ?
    `, [req.params.id]);

    res.json({ 
      success: true, 
      data: { 
        ...submission[0], 
        programs,
        notes 
      }
    });
  } catch (error) {
    console.error('Error fetching submission:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST create submission
router.post('/', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { center_id, submitted_by, program_ids = [], notes } = req.body;

    // Create submission
    const [result] = await connection.query(`
      INSERT INTO program_submissions (center_id, submitted_by, submission_status)
      VALUES (?, ?, 'submitted')
    `, [center_id, submitted_by]);

    const submissionId = result.insertId;

    // Link programs to submission
    for (const programId of program_ids) {
      await connection.query(
        'INSERT INTO submission_programs (submission_id, program_id) VALUES (?, ?)',
        [submissionId, programId]
      );
    }

    // Add notes if provided
    if (notes) {
      await connection.query(`
        INSERT INTO submission_notes (submission_id, note_content, created_by)
        VALUES (?, ?, ?)
      `, [submissionId, notes, submitted_by]);
    }

    // Update program statuses to 'submitted'
    if (program_ids.length > 0) {
      await connection.query(`
        UPDATE programs SET status = 'submitted' WHERE program_id IN (?)
      `, [program_ids]);
    }

    await connection.commit();
    res.status(201).json({ 
      success: true, 
      message: 'Submission created successfully',
      data: { submission_id: submissionId }
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error creating submission:', error);
    res.status(500).json({ success: false, message: error.message });
  } finally {
    connection.release();
  }
});

// PUT update submission status (for reviewers)
router.put('/:id/status', async (req, res) => {
  try {
    const { status, reviewed_by, review_comments } = req.body;
    
    await pool.query(`
      UPDATE program_submissions SET
        submission_status = ?,
        reviewed_by = ?,
        reviewed_at = CURRENT_TIMESTAMP,
        review_comments = ?
      WHERE submission_id = ?
    `, [status, reviewed_by, review_comments, req.params.id]);

    // If approved, update all linked programs
    if (status === 'approved') {
      await pool.query(`
        UPDATE programs p
        JOIN submission_programs sp ON p.program_id = sp.program_id
        SET p.status = 'approved', p.approved_by = ?, p.approved_at = CURRENT_TIMESTAMP
        WHERE sp.submission_id = ?
      `, [reviewed_by, req.params.id]);
    }

    res.json({ success: true, message: 'Submission status updated' });
  } catch (error) {
    console.error('Error updating submission:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST add note to submission
router.post('/:id/notes', async (req, res) => {
  try {
    const { note_content, note_type, created_by } = req.body;
    
    const [result] = await pool.query(`
      INSERT INTO submission_notes (submission_id, note_content, note_type, created_by)
      VALUES (?, ?, ?, ?)
    `, [req.params.id, note_content, note_type || 'general', created_by]);

    res.status(201).json({ 
      success: true, 
      message: 'Note added successfully',
      data: { note_id: result.insertId }
    });
  } catch (error) {
    console.error('Error adding note:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
