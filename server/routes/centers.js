import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// GET all centers
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        center_id, center_name, center_code, icon, 
        color_gradient, description, is_active
      FROM centers 
      WHERE is_active = TRUE 
      ORDER BY center_name
    `);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching centers:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET center by ID with summary
router.get('/:id', async (req, res) => {
  try {
    const [center] = await pool.query(
      'SELECT * FROM centers WHERE center_id = ?',
      [req.params.id]
    );
    
    if (center.length === 0) {
      return res.status(404).json({ success: false, message: 'Center not found' });
    }

    // Get program counts
    const [summary] = await pool.query(`
      SELECT 
        COUNT(DISTINCT CASE WHEN pt.type_code = 'ADVANCED' THEN p.program_id END) AS advanced_count,
        COUNT(DISTINCT CASE WHEN pt.type_code = 'STEAM' THEN p.program_id END) AS steam_count,
        COUNT(DISTINCT CASE WHEN pt.type_code = 'CROSS_CENTER' THEN p.program_id END) AS cross_center_count
      FROM programs p
      JOIN program_types pt ON p.program_type_id = pt.program_type_id
      WHERE p.center_id = ?
    `, [req.params.id]);

    res.json({ 
      success: true, 
      data: { ...center[0], summary: summary[0] }
    });
  } catch (error) {
    console.error('Error fetching center:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET center summary (for dashboard)
router.get('/summary/all', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM vw_center_summary');
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching center summary:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
