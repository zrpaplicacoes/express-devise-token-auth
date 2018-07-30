const app = require('./support/express');
const request = require('supertest');
const nock = require('nock');

describe('Devise authentication tests', () => {
  const userInfo = {
    uid: 'zrp@zrp.com.br',
    client: 'IPxcM8N29oeA-oFr7JiBTA',
    token: 'lD-798sezWm3PMEoGCEKww',
  };

  const successPayload = {
    success: true,
    data: {
      id: 28,
      provider: 'email',
      uid: 'zrp@zrp.com.br',
      name: null,
      nickname: null,
      image: null,
      email: 'zrp@zrp.com.br',
    },
  };

  describe('with valid token', () => {
    let response;

    beforeAll(async () => {
      const path = '/v1/auth/indicator/validate_token';

      const successHeaders = {
        'access-token': 'new-access-token',
        'uid': userInfo.uid,
        'client': 'new-client',
        'expiry': 3200,
      };

      nock('https://myapi.com.br:443')
        .get(path)
        .reply(200, successPayload, successHeaders);

      response = await request(app)
        .get('/')
        .set('uid', userInfo.uid)
        .set('client', userInfo.client)
        .set('access-token', userInfo.token)
        .set('expiry', 3200);
    });

    test('can access routes', () => {
      expect(response.statusCode).toBe(200);
    });

    test('should contain user info', () => {
      expect(response.body.uid).toBe(userInfo.uid);
    });

    test('should adds new headers information returned from server', () => {
      expect(response.headers['access-token']).toBe('new-access-token');
      expect(response.headers['client']).toBe('new-client');
      expect(response.headers['uid']).toBe(userInfo.uid);
      expect(response.headers['expiry']).toBe('3200');
    });
  });

  describe('with empty headers response from devise', () => {
    let response;

    beforeAll(async () => {
      const path = '/v1/auth/indicator/validate_token';

      nock('https://myapi.com.br:443')
        .get(path)
        .reply(200, successPayload);

      response = await request(app)
        .get('/')
        .set('uid', userInfo.uid)
        .set('client', userInfo.client)
        .set('access-token', userInfo.token)
        .set('expiry', 3200);
    });

    test('can access routes', () => {
      expect(response.statusCode).toBe(200);
    });

    test('should contain user info', () => {
      expect(response.body.uid).toBe(userInfo.uid);
    });

    test('should adds new headers information returned from server', () => {
      expect(response.headers['access-token']).toBe(userInfo.token);
      expect(response.headers['client']).toBe(userInfo.client);
      expect(response.headers['uid']).toBe(userInfo.uid);
      expect(response.headers['expiry']).toBe('3200');
    });
  });

  describe('with invalid token', () => {
    let response;

    beforeAll(async () => {
      const path = '/v1/auth/indicator/validate_token';

      nock('https://myapi.com.br:443')
        .get(path)
        .reply(401, {
          'success': false,
          'errors': ['Dados de login inválidos.'],
        });

      response = await request(app)
        .get('/')
        .set('uid', userInfo.uid)
        .set('client', userInfo.client)
        .set('access-token', userInfo.token + 'wrong')
        .set('expiry', 3200);
    });

    test('can not access routes', () => {
      expect(response.statusCode).toBe(401);
    });

    test('should not contain user info', () => {
      expect(response.body).toEqual({});
    });
  });
});
