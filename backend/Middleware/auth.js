const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your-long-secret';

const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Ensure the token is in the format "Bearer <token>"
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid token' });
      } else {
        req.userId = decodedToken.userId;
        next();
      }
    });
  } else {
    res.status(401).json({ message: 'No token provided' });
  }
};

module.exports = requireAuth;
