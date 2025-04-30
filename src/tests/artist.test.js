// src/tests/artist.test.js
import request from 'supertest';
import app from '../app.js';

describe('GET /api/artists', () => {
  it('should fetch all artists', async () => {
    const res = await request(app).get('/api/artists');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveLength(0); // Adjust after seeding
  });
});