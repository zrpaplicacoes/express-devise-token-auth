'use strict';

const http = require('http');
const https = require('https');

const config = {
  deviseURL: 'http://localhost:3000',
  deviseScope: 'v1',
};

async function authentication(req, res, next) {
  const {client, uid, expiry, user_type,  correspondent_id} = req.headers;
  const token = req.get('access-token');
  let authInfo = {
    body: {},
    headers: {},
  };

  try {
    authInfo = await _checkToken(uid, client, token, expiry,  user_type, correspondent_id);
  } catch (err) {
    authInfo.body.success = false;
    throw (err);
  }

  if (authInfo.body.success) {
    req.user = authInfo.body.data;
    res.set('access-token', authInfo.headers['access-token']);
    res.set('client', authInfo.headers['client']);
    res.set('expiry', authInfo.headers['expiry']);
    res.set('uid', authInfo.headers['uid']);
    next();
  } else {
    console.info('Attempt Unauthorized Access', authInfo.body.errors);
    res.status(401).send('Unauthorized');
  }
};

function customAuth(customConfig) {
  if (customConfig.deviseURL !== undefined) {
    config.deviseURL = customConfig.deviseURL;
  }

  if (customConfig.deviseScope !== undefined) {
    config.deviseScope = customConfig.deviseScope;
  }
};

function makeRequest(options) {
  const requestor = config.deviseURL.match('https') ? https : http;

  return new Promise((resolve, reject) => {
    const res = requestor.request(options, function(resp) {
      let data = '';

      resp.on('data', function(chunk) {
        data += chunk;
      });

      resp.on('end', function() {
        resolve({body: JSON.parse(data), headers: resp.headers});
      });
    });

    res.on('error', (error) => {
      reject(error);
    });

    res.end();
  });
}

function _checkToken(uid, client, token, expiry, user_type = 'indicator', correspondent_id = undefined) {
  let requestor, hostname, port;

  const headers = {
    uid,
    client,
    'access-token': token,
    expiry,
  };

  if (correspondent_id) {
    Object.assign(headers, {correspondent_id});
  }

  [hostname, port] = config.deviseURL.replace('https://', '').replace('http://', '').split(':');

  port = port || 80;
  port = parseInt(port);

  const options = {
    hostname,
    port,
    path: `/${config.deviseScope}/auth/${user_type}/validate_token`,
    method: 'GET',
    headers,
  };

  return makeRequest(options);
}

module.exports = {
  authentication,
  customAuth,
};
