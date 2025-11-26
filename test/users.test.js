/* eslint-disable no-undef */
require('dotenv').config();
const { expect } = require('chai');
const request = require('supertest');
const jwt = require('jsonwebtoken');

// Ensure a known secret for tests
process.env.JWT_SECRET = process.env.JWT_SECRET || 'very_secret_for_tests';

const app = require('../app');
const usersStore = require('../app').usersStore;

describe('Users API', () => {
  beforeEach(() => {
    // Clear the in-memory store before each test
    usersStore.clear();
  });

  afterEach(() => {
    usersStore.clear();
  });

  it('GET / should return ok', async () => {
    // SuperTest call -> routes to `GET /` defined in `app.js` at line 10
    // app.js:10 -> app.get('/', (req, res) => res.json({ ok: true }));
    const res = await request(app).get('/');
    expect(res.status).to.equal(200);
    expect(res.body).to.deep.equal({ ok: true });
  });

  it('POST /api/register should create a user and return 201 with id', async () => {
    const payload = { name: 'Alice', email: 'alice@example.com' };
    // SuperTest call -> POST /api/register handled by
    // routes/users.js:10 -> router.post('/api/register', usersController.register(store));
    // controller: controllers/usersController.js:7-18 -> exports.register
    const res = await request(app).post('/api/register').send(payload);
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('id');
    expect(res.body.email).to.equal(payload.email);
  });

  it('POST /api/login returns token for existing user', async () => {
    const payload = { name: 'Bob', email: 'bob@example.com' };
    // Register the user first (see controller register)
    // SuperTest POST /api/register -> controller at controllers/usersController.js:7-18
    const r1 = await request(app).post('/api/register').send(payload);
    expect(r1.status).to.equal(201);

    // Now login: SuperTest POST /api/login handled by
    // routes/users.js:13 -> router.post('/api/login', usersController.login(store));
    // controller: controllers/usersController.js:21-31 -> exports.login
    const r2 = await request(app).post('/api/login').send({ email: payload.email });
    expect(r2.status).to.equal(200);
    expect(r2.body).to.have.property('token');
  });

  it('GET /api/users without token returns 401 no_token', async () => {
    // SuperTest GET /api/users without Authorization header
    // routes/users.js:16 -> router.get('/api/users', authMiddleware(store), usersController.list(store));
    // auth middleware -> lib/auth.js:15-28 (returns 401 { error: 'no_token' } when header missing)
    const res = await request(app).get('/api/users');
    expect(res.status).to.equal(401);
    expect(res.body).to.deep.equal({ error: 'no_token' });
  });

  it('GET /api/users with token returns data array including created user', async () => {
    const payload = { name: 'Carol', email: 'carol@example.com' };
    // Register user (POST /api/register) -> controllers/usersController.register
    const r1 = await request(app).post('/api/register').send(payload);
    expect(r1.status).to.equal(201);

    // Login to obtain token (POST /api/login) -> controllers/usersController.login
    const login = await request(app).post('/api/login').send({ email: payload.email });
    expect(login.status).to.equal(200);
    const token = login.body.token;

    // Use token to call protected route GET /api/users
    // auth middleware verifies token with lib/auth.js:9-11 verifyToken
    const list = await request(app).get('/api/users').set('Authorization', `Bearer ${token}`);
    expect(list.status).to.equal(200);
    expect(list.body).to.have.property('data');
    expect(list.body.data).to.be.an('array');
    expect(list.body.data.some(u => u.email === payload.email)).to.be.true;
  });

  it('GET /api/users/:id with invalid id returns 404', async () => {
    // Create a user and then query some other id
    const payload = { name: 'Dan', email: 'dan@example.com' };
    // Register the user to obtain a valid user in the store
    const r1 = await request(app).post('/api/register').send(payload);
    expect(r1.status).to.equal(201);

    // Login to obtain token
    const login = await request(app).post('/api/login').send({ email: payload.email });
    const token = login.body.token;

    // Query a non-existent user id -> controllers/usersController.getById at lines 40-45
    const res = await request(app).get('/api/users/invalid-id-123').set('Authorization', `Bearer ${token}`);
    expect(res.status).to.equal(404);
    expect(res.body).to.deep.equal({ error: 'not_found' });
  });

  it('Manual token signing works for GET /api/users/:id', async () => {
    const payload = { name: 'Eve', email: 'eve@example.com' };
    const r1 = await request(app).post('/api/register').send(payload);
    expect(r1.status).to.equal(201);
    const user = r1.body;

    // Manually sign using the same secret
    const secret = process.env.JWT_SECRET || 'supersecret';
    const token = jwt.sign({ sub: user.id, email: user.email }, secret, { expiresIn: '1h' });

    // Use the manually-signed token to call GET /api/users/:id
    // This hits routes/users.js:19 -> authMiddleware then controllers/usersController.getById
    // auth verification uses lib/auth.js:22 -> jwt.verify
    const res = await request(app).get(`/api/users/${user.id}`).set('Authorization', `Bearer ${token}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('data');
    expect(res.body.data.id).to.equal(user.id);
  });
});
