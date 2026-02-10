const request = require('supertest');
const express = require('express');
const app = require('./server');

describe('GET /facts', () => {

  // Normal Cases

  // Normal Case 1: Verify that the endpoint returns the full list of facts when no query parameter is provided.
  it('Normal Case 1: should return all facts when no number is provided', async () => {
    const res = await request(app).get('/facts');
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.facts)).toBe(true);
  });

  // Normal Case 2: Verify that the endpoint returns exactly one fact when ?number=1 is requested.
  it('Normal Case 2: should return exactly 1 fact when requested', async () => {
    const res = await request(app).get('/facts?number=1');
    expect(res.statusCode).toEqual(200);
    expect(res.body.facts.length).toBe(1);
  });

  // Normal Case 3: Verify that the endpoint returns exactly three facts when ?number=3 is requested.
  it('Normal Case 3: should return exactly 3 facts when requested', async () => {
    const res = await request(app).get('/facts?number=3');
    expect(res.statusCode).toEqual(200);
    expect(res.body.facts.length).toBe(3);
  });

  //Edge Cases

  // Edge Case 1: Verify that the endpoint returns a 400 Bad Request if the 'number' parameter is not a number (e.g. text).
  it('Edge Case 1: should return 400 for non-numeric inputs (e.g. "invalid")', async () => {
    const res = await request(app).get('/facts?number=invalid');
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });

  // Edge Case 2: Verify that the endpoint returns a 400 Bad Request if the request asks for 0 facts (invalid logical request).
  it('Edge Case 2: should return 400 if number is 0', async () => {
    const res = await request(app).get('/facts?number=0');
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });

  // Edge Case 3: Verify that the endpoint returns a 400 Bad Request if the number is negative.
  it('Edge Case 3: should return 400 if number is negative', async () => {
    const res = await request(app).get('/facts?number=-5');
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });

});