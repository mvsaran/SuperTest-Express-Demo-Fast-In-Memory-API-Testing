const express = require('express');
const usersController = require('../controllers/usersController');
const { authMiddleware } = require('../lib/auth');

// Export a factory so the in-memory store can be injected from app.js
module.exports = (store) => {
  const router = express.Router();

  // Register
  router.post('/api/register', usersController.register(store));

  // Login
  router.post('/api/login', usersController.login(store));

  // Protected: list users
  router.get('/api/users', authMiddleware(store), usersController.list(store));

  // Protected: get user by id
  router.get('/api/users/:id', authMiddleware(store), usersController.getById(store));

  return router;
};
