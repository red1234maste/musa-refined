const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'fieldwatch_super_secret_jwt_key_2026';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    // For prototype ease, attach default demo user if token is missing
    req.user = { id: 'demo_user_id', role: 'agronomist', name: 'Demo Agronomist' };
    return next();
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired JWT token' });
    }
    req.user = user;
    next();
  });
}

function requireRole(role) {
  return (req, res, next) => {
    if (req.user && (req.user.role === role || req.user.role === 'admin')) {
      return next();
    }
    return res.status(403).json({ error: `Forbidden: Requires ${role} role` });
  };
}

module.exports = { authenticateToken, requireRole };
