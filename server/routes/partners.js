import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// GET all external partners
router.get('/external', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT * FROM external_partners 
      WHERE is_active = TRUE 
      ORDER BY partner_name
    `);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching external partners:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET all placement partners
router.get('/placement', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT * FROM placement_partners 
      WHERE is_active = TRUE 
      ORDER BY partner_name
    `);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching placement partners:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST create external partner
router.post('/external', async (req, res) => {
  try {
    const { partner_name, partner_type, contact_email, contact_phone, website, address } = req.body;
    
    const [result] = await pool.query(`
      INSERT INTO external_partners 
        (partner_name, partner_type, contact_email, contact_phone, website, address)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [partner_name, partner_type, contact_email, contact_phone, website, address]);

    res.status(201).json({ 
      success: true, 
      message: 'Partner created successfully',
      data: { partner_id: result.insertId }
    });
  } catch (error) {
    console.error('Error creating external partner:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST create placement partner
router.post('/placement', async (req, res) => {
  try {
    const { partner_name, industry_sector, placement_type, contact_person, contact_email, contact_phone } = req.body;
    
    const [result] = await pool.query(`
      INSERT INTO placement_partners 
        (partner_name, industry_sector, placement_type, contact_person, contact_email, contact_phone)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [partner_name, industry_sector, placement_type, contact_person, contact_email, contact_phone]);

    res.status(201).json({ 
      success: true, 
      message: 'Placement partner created successfully',
      data: { placement_partner_id: result.insertId }
    });
  } catch (error) {
    console.error('Error creating placement partner:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
