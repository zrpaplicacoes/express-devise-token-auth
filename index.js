'use strict';

const http = require('http');

// verificar url para user e admin

const config = {
  deviseURL: 'http://localhost:3000',
  deviseScope: 'v1',
  deviseFor: 'indicator',
};

async function authentication(req, res, next) {
  const {client, uid} = req.headers;
  const token = req.get('access-token');
  let authStatus = {};

  try {
    authStatus = await _checkToken(uid, client, token);
  } catch (err) {
    authStatus.success = false;
    throw (err); // tratar erro
  }

  if (authStatus.success) {
    req.user = authStatus.data;
    next();
  } else {
    console.info('Attempt Unauthorized Access', authStatus.errors);
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

function _checkToken(uid, client, token) {
  const url = (`${config.deviseURL}/
                ${config.deviseScope}/auth/
                ${config.deviseFor}
                /validate_token?
                uid=${uid}
                &client=${client}
                &access-token=${token}`).replace(/\s+/g, '');

// replace(/\/\//g, '/')              

  return new Promise((resolve, reject) => {
    http.get(url, (resp) => {
      let data = '';

      resp.on('data', (chunk) => {
        data += chunk;
      });

      resp.on('end', () => {
        resolve(JSON.parse(data));
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
