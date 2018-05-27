'use strict';

const axios = require('axios');

// verificar url para user e admin

const config = {
  deviseURL: 'http://localhost:3000',
  deviseScope: 'v1',
  deviseFor: 'indicator',
};

async function authentication(req, res, next) {
  const {client, uid} = req.headers;
  const token = req.get('access-token');

  const authStatus = await _checkToken(uid, client, token);

  if (authStatus.success === true) {
    next();
  } else {
    console.info('Attempt Unauthorized Access', authStatus.errors);
    res.status(401).send('Unauthorized');
  }
};

/* function use(customConfig) {
  if (customConfig.deviseURL !== undefined) {
    config.deviseURL = customConfig.deviseURL;
  }

  if (customConfig.deviseScope !== undefined) {
    config.deviseScope = customConfig.deviseScope;
  }
}; */

function _checkToken(uid, client, token) {
  const url = (`${config.deviseURL}/
                ${config.deviseScope}/auth/
                ${config.deviseFor}
                /validate_token?
                uid=${uid}
                &client=${client}
                &access-token=${token}`).replace(/\s+/g, '');

  return axios.get(url)
          .then((response) => {
            return response.data;
          })
          .catch((error) => {
            if (error.response.status === 401) return error.response.data;
            console.error('Error on checkToken', error);
          });
};

module.exports = {
  authentication,
};
