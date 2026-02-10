const request = require('supertest');
const express = require('express');
const app = require('./server');

describe('GET /facts', () => {
  it('should return all facts when no number is provided', async () => {
    const res = await request(app).get('/facts');
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.facts)).toBe(true);
  });

  it('should return a specific number of facts', async () => {
    const res = await request(app).get('/facts?number=1');
    expect(res.body.facts.length).toBe(1);
  });

  it('should return 400 for invalid number parameter', async () => {
    const res = await request(app).get('/facts?number=invalid');
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });
});