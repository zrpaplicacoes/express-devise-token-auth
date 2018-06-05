'use strict';

const https = require('https');

const config = {
  deviseURL: 'https://localhost:3000',
  deviseScope: 'v1',
  deviseFor: 'indicator',
};

async function authentication(req, res, next) {
  const {client, uid, expiry} = req.headers;
  const token = req.get('access-token');
  let authInfo = {
    body: {},
    headers: {},
  };

  try {
    authInfo = await _checkToken(uid, client, token, expiry);
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

  if (customConfig.deviseFor !== undefined) {
    config.deviseFor = customConfig.deviseFor;
  }
};

function _checkToken(uid, client, token, expiry) {
  const url = (`${config.deviseURL}/
                ${config.deviseScope}/auth/
                ${config.deviseFor}
                /validate_token?
                uid=${uid}
                &client=${client}
                &access-token=${token}
                &expiry=${expiry}`).replace(/(\w)\/\//g, '$1/').replace(/\s+/g, '');

  return new Promise(function(resolve, reject) {
    https.get(url, function(resp) {
      let data = '';

      resp.on('data', function(chunk) {
        data += chunk;
      });

      resp.on('end', function() {
        resolve({body: JSON.parse(data), headers: resp.headers});
      });
    }).on('error', (error) => {
      console.error('Error on checkToken');
      reject(error);
    });
  });
}

module.exports = {
  authentication,
  customAuth,
};
