const app = require('./support/express');
const request = require('supertest');
const nock = require('nock');

describe('Devise authentication tests', () => {
  let userInfo;

  beforeAll(() => {
    userInfo = {
      uid: 'zrp@zrp.com.br',
      client: 'IPxcM8N29oeA-oFr7JiBTA',
      token: 'lD-798sezWm3PMEoGCEKww',
    };
  });

  describe('with valid token', () => {
    let response;

    beforeAll(async () => {
      const path = (`/v1/auth/indicator/validate_token?
                   uid=${userInfo.uid}
                   &client=${userInfo.client}
                   &access-token=${userInfo.token}`).replace(/\s+/g, '');

      nock('http://localhost:3000')
      .get(path)
      .reply(200, {success: true,
                    data:
                    {id: 28,
                      provider: 'email',
                      uid: 'zrp@zrp.com.br',
                      name: null,
                      nickname: null,
                      image: null,
                      email: 'zrp@zrp.com.br',
                    },
                  }
      );

      response = await request(app)
        .get('/')
        .set('uid', userInfo.uid)
        .set('client', userInfo.client)
        .set('access-token', userInfo.token);
    });

    test('can access routes', () => {
      expect(response.statusCode).toBe(200);
    });

    test('should contain user info', () => {
      expect(response.body.uid).toBe(userInfo.uid);
      expect(response.body.uid).toBe('zrp@zrp.com.br');
      expect(response.body.id).not.toBe('28');
    });
  });

  describe('with invalid token', () => {
    let response;

    beforeAll(async () => {
      const path = (`/v1/auth/indicator/validate_token?
                   uid=${userInfo.uid}
                   &client=${userInfo.client}
                   &access-token=${userInfo.token}wrong`).replace(/\s+/g, '');

      nock('http://localhost:3000')
      .get(path)
      .reply(401, {
                    'success': false,
                    'errors': ['Dados de login inválidos.'],
                  }
      );

      response = await request(app)
        .get('/')
        .set('uid', userInfo.uid)
        .set('client', userInfo.client)
        .set('access-token', userInfo.token + 'wrong');
    });

    test('can not access routes', () => {
      expect(response.statusCode).toBe(401);
    });

    test('should not contain user info', () => {
      expect(response.body).toEqual({});
    });
  });
});
