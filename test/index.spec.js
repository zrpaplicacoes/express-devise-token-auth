const app = require('./support/express');
// const utils = require('./support/utils');
const request = require('supertest');
const nock = require('nock');

describe('Devise authentication tests', () => {
  let userInfo;

  beforeAll(async () => {
    // const headers = await utils.createUser();

    userInfo = {
      uid: 'carloslima@zrp.com.br',
      client: 'IPxcM8N29oeA-oFr7JiBTA',
      token: 'lD-798sezWm3PMEoGCEKww',
    };
  });

  describe('with valid token', () => {
    let response;

    beforeAll(async () => {
      response = nock('http://myapp.iriscouch.com')
                  .get('/')
                  .set('uid', userInfo.uid)
                  .set('client', userInfo.client)
                  .set('access-token', userInfo.token)
                  .reply(200, {data:
                                {success: true,
                                  data:
                                  {id: 28,
                                    provider: 'email',
                                    uid: 'zrp@zrp.com.br',
                                    name: null,
                                    nickname: null,
                                    image: null,
                                    email: 'zrp@zrp.com.br',
                                  },
                                },
                              }
                            );
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
