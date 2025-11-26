require('dotenv').config();
const express = require('express');

const createUsersRouter = require('./routes/users');

const app = express();
app.use(express.json());

// Simple root health check
app.get('/', (req, res) => res.json({ ok: true }));

// In-memory user store accessible to tests
const usersStore = new Map();

// Mount users routes, injecting the store
app.use('/', createUsersRouter(usersStore));

module.exports = app;
module.exports.usersStore = usersStore;
