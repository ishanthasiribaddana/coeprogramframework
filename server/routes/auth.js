import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';

const router = express.Router();

// POST login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const [users] = await pool.query(`
      SELECT u.*, r.role_name, r.role_code, r.permissions
      FROM users u
      JOIN roles r ON u.role_id = r.role_id
      WHERE u.email = ? AND u.is_active = TRUE
    `, [email]);

    if (users.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const user = users[0];
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Get user's assigned centers
    const [centers] = await pool.query(`
      SELECT c.center_id, c.center_name, c.center_code, c.icon, uc.is_lead_consultant
      FROM user_centers uc
      JOIN centers c ON uc.center_id = c.center_id
      WHERE uc.user_id = ?
    `, [user.user_id]);

    // Update last login
    await pool.query('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE user_id = ?', [user.user_id]);

    // Generate JWT
    const token = jwt.sign(
      { 
        user_id: user.user_id, 
        email: user.email, 
        role: user.role_code 
      },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      success: true,
      data: {
        token,
        user: {
          user_id: user.user_id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role_code,
          role_name: user.role_name,
          permissions: user.permissions,
          centers
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST register (admin only in production)
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, first_name, last_name, role_id } = req.body;

    // Check if user exists
    const [existing] = await pool.query(
      'SELECT user_id FROM users WHERE email = ? OR username = ?',
      [email, username]
    );

    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    const [result] = await pool.query(`
      INSERT INTO users (username, email, password_hash, first_name, last_name, role_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [username, email, password_hash, first_name, last_name, role_id || 2]);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: { user_id: result.insertId }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET current user profile
router.get('/me', async (req, res) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');

    const [users] = await pool.query(`
      SELECT u.user_id, u.username, u.email, u.first_name, u.last_name,
             r.role_name, r.role_code, r.permissions
      FROM users u
      JOIN roles r ON u.role_id = r.role_id
      WHERE u.user_id = ?
    `, [decoded.user_id]);

    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const [centers] = await pool.query(`
      SELECT c.center_id, c.center_name, c.center_code, c.icon, uc.is_lead_consultant
      FROM user_centers uc
      JOIN centers c ON uc.center_id = c.center_id
      WHERE uc.user_id = ?
    `, [decoded.user_id]);

    res.json({
      success: true,
      data: { ...users[0], centers }
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }
    console.error('Profile error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
