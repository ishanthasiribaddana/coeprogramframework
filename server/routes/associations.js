import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// GET all student associations
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT * FROM student_associations 
      WHERE is_active = TRUE 
      ORDER BY association_name
    `);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching associations:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET associations by center (relevant associations)
router.get('/center/:centerId', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT sa.*, ca.relevance_level
      FROM student_associations sa
      LEFT JOIN center_associations ca ON sa.association_id = ca.association_id 
        AND ca.center_id = ?
      WHERE sa.is_active = TRUE
      ORDER BY ca.relevance_level DESC, sa.association_name
    `, [req.params.centerId]);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching center associations:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST create association
router.post('/', async (req, res) => {
  try {
    const { association_name, association_code, description } = req.body;
    
    const [result] = await pool.query(`
      INSERT INTO student_associations (association_name, association_code, description)
      VALUES (?, ?, ?)
    `, [association_name, association_code, description]);

    res.status(201).json({ 
      success: true, 
      message: 'Association created successfully',
      data: { association_id: result.insertId }
    });
  } catch (error) {
    console.error('Error creating association:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
