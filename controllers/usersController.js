const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'supersecret';

// register(store) -> handler
exports.register = (store) => async (req, res) => {
  const { name, email } = req.body || {};
  if (!email) {
    return res.status(400).json({ error: 'email_required' });
  }

  const id = uuidv4();
  const user = { id, name: name || '', email };
  store.set(id, user);

  return res.status(201).json(user);
};

// login(store) -> handler
exports.login = (store) => async (req, res) => {
  const { email } = req.body || {};
  if (!email) return res.status(400).json({ error: 'email_required' });

  // find user by email
  const user = Array.from(store.values()).find((u) => u.email === email);
  if (!user) return res.status(401).json({ error: 'invalid_credentials' });

  const token = jwt.sign({ sub: user.id, email: user.email }, SECRET, { expiresIn: '1h' });
  return res.json({ token });
};

// list(store) -> handler
exports.list = (store) => async (req, res) => {
  const data = Array.from(store.values());
  return res.json({ data });
};

// getById(store) -> handler
exports.getById = (store) => async (req, res) => {
  const { id } = req.params;
  const user = store.get(id);
  if (!user) return res.status(404).json({ error: 'not_found' });
  return res.json({ data: user });
};
