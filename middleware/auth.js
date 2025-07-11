const jwt = require('jsonwebtoken');
const SECRET = 'yourSuperSecretKey';

function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid token' });
  }
}

module.exports = auth;
router.get('/profile', auth, async (req, res) => {
  const user = await User.findById(req.userId);
  res.json(user);
});
