const request = require('supertest');
const { createApp } = require('../app');

describe('GET /health', () => {
	it('returns { ok: true }', async () => {
		const app = createApp();
		const response = await request(app).get('/health').expect(200);
		expect(response.body).toEqual({ ok: true });
	});
});
