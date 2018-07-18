/* eslint-disable camelcase */
'use strict';

const http = require('http');
const https = require('https');

function authentication(config) {
  return (req, res, next) => {
    const {
      client,
      uid,
      expiry,
      correspondent_id,
    } = req.headers;
    const token = req.get('access-token');

    if (!client || !uid || !expiry || !token) {
      console.info('Attempt Unauthorized Access');
      res.status(401).send('Unauthorized');
      return;
    }

    _checkToken(uid, client, token, expiry, correspondent_id, config).then((authInfo) => {
      req.user = authInfo.body.data;
      res.set('access-token', authInfo.headers['access-token']);
      res.set('client', authInfo.headers['client']);
      res.set('expiry', authInfo.headers['expiry']);
      res.set('uid', authInfo.headers['uid']);
      next();
    }).catch((authInfo) => {
      res.status(401).send('Unauthorized');
    });
  };
};

function makeRequest(options, config) {
  const requestor = config.deviseURL.match('https') ? https : http;
  return new Promise((resolve, reject) => {
    const res = requestor.request(options, (resp) => {
      let data = '';

      resp.on('data', (chunk) => {
        data += chunk;
      });

      resp.on('end', () => {
        if (resp.statusCode !== 200) {
          reject({
            status: resp.statusCode,
            body: JSON.parse(data),
          });
        } else {
          resolve({
            body: JSON.parse(data),
            headers: resp.headers,
          });
        }
      });
    });

    res.on('error', (error) => {
      console.log(error);
      reject(error);
    });

    res.end();
  });
}

function _checkToken(uid, client, token, expiry, correspondent_id = undefined, config) {
  let hostname;
  let port;

  const headers = {
    uid,
    client,
    'access-token': token,
    expiry,
  };

  if (correspondent_id) {
    Object.assign(headers, {
      correspondent_id,
    });
  }

  [hostname, port] = config.deviseURL.replace('https://', '').replace('http://', '').split(':');
  port = port || 80;
  port = parseInt(port);

  const options = {
    hostname,
    port,
    path: `/${config.deviseScope}/auth/${config.deviseFor}/validate_token`,
    method: 'GET',
    headers,
  };
  return makeRequest(options, config);
}

module.exports = authentication;
