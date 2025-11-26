const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'supersecret';

function signToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: '1h' });
}

function verifyToken(token) {
  return jwt.verify(token, SECRET);
}

// Express middleware factory: verifies Bearer token and attaches decoded to req.user
function authMiddleware() {
  return (req, res, next) => {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'no_token' });
    }
    const token = auth.slice(7).trim();
    try {
      const decoded = verifyToken(token);
      req.user = decoded;
      return next();
    } catch (err) {
      return res.status(401).json({ error: 'invalid_token' });
    }
  };
}

module.exports = { signToken, verifyToken, authMiddleware };
