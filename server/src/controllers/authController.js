const db = require('../db/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.full_name },
    config.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase().trim());
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const valid = bcrypt.compareSync(password, user.password_hash);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = generateToken(user);
  return res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      role: user.role,
      phone: user.phone
    }
  });
}

function demoLogin(req, res) {
  const { role } = req.body;
  const targetEmail = role === 'general_manager' 
    ? 'gm@coffeeridge.com' 
    : (role === 'reservations_staff' ? 'reservations@coffeeridge.com' : 'guest@example.com');

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(targetEmail);
  if (!user) {
    return res.status(404).json({ error: `Demo user for role ${role} not found` });
  }

  const token = generateToken(user);
  return res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      role: user.role,
      phone: user.phone
    }
  });
}

function getMe(req, res) {
  const user = db.prepare('SELECT id, email, full_name, role, phone FROM users WHERE id = ?').get(req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  return res.json({
    user: {
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      role: user.role,
      phone: user.phone
    }
  });
}

module.exports = {
  login,
  demoLogin,
  getMe
};

