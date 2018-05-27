const app = require('./support/express');
const utils = require('./support/utils');
const request = require('supertest');

describe('Devise authentication tests', () => {
  let userInfo;

  beforeAll(async () => {
    const headers = await utils.createUser();

    userInfo = {
      uid: headers.uid,
      client: headers.client,
      token: headers['access-token'],
    };
  });

  describe('with valid token', () => {
    let response;

    beforeAll(async () => {
      response = await request(app)
        .get('/')
        .set('uid', userInfo.uid)
        .set('client', userInfo.client)
        .set('access-token', userInfo.token);
    });

    test('can access routes', () => {
      expect(response.statusCode).toBe(200);
    });
  });

  describe('with invalid token', () => {
    let response;

    beforeAll(async () => {
      response = await request(app)
        .get('/')
        .set('uid', userInfo.uid)
        .set('client', userInfo.client)
        .set('access-token', userInfo.token + 'wrong');
    });

    test('can not access routes', () => {
      expect(response.statusCode).toBe(401);
    });
  });
});