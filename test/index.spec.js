const app = require('./support/express');
const utils = require('./support/utilsUser');
const request = require('supertest');

describe('Devise authentication tests', () => {
  let userInfo;

  beforeAll(() => {
    // userInfo = utils.createUser();
    userInfo = {
      uid: 'carlos@zrp.com.br',
      client: 'YnGQlR5KyYbPlHuNNR5PhQ',
      token: 'VufRzOxQ5Mx-av0uQPcIcA',
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
});
