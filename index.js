const http = require('http');
const https = require('https');

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
          reject(new Error(resp.statusCode));
        } else {
          resolve({
            body: JSON.parse(data),
            headers: resp.headers,
          });
        }
      });
    });

    res.on('error', (error) => {
      Error(error);
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

  [hostname, port] = config.deviseURL.replace('https://', '').replace('http://', '').split(':'); /* eslint-disable-line */
  port = port || 80;
  port = parseInt(port, 0);

  const options = {
    hostname,
    port,
    path: `/${config.deviseScope}/auth/${config.deviseFor}/validate_token`,
    method: 'GET',
    headers,
  };
  return makeRequest(options, config);
}

function authentication(config) {
  return (req, res, next) => {
    const {
      client,
      uid,
      expiry,
      correspondent_id,
    } = req.headers;

    const innerAuthorization = req.headers['inner-authorization'];

    if (innerAuthorization) {
      console.info('Intern authorization required');
      if (innerAuthorization === config.inner_authorization) {
        console.info('Attempt Authorized Intern Access');
        return next();
      }
      console.info('Attempt Unauthorized Access');
      return res.status(401).send('Unauthorized');
    }

    const token = req.get('access-token');

    if (!client || !uid || !expiry || !token) {
      console.info('Attempt Unauthorized Access');
      return res.status(401).send('Unauthorized');
    }

    _checkToken(uid, client, token, expiry, correspondent_id, config)
      .then((authInfo) => {
        req.user = authInfo.body.data;

        /*
        * Solve problem with empty headers response from devise-token-auth
        * The problem is described here:
        * https://github.com/lynndylanhurley/devise_token_auth/issues/1053
        */

        if (authInfo.headers.client) {
          res.set('access-token', authInfo.headers['access-token']);
          res.set('client', authInfo.headers.client);
          res.set('expiry', authInfo.headers.expiry);
          res.set('uid', authInfo.headers.uid);
          res.set('token-type', 'Bearer');
        } else {
          res.set('access-token', token);
          res.set('client', client);
          res.set('expiry', expiry);
          res.set('uid', uid);
          res.set('token-type', 'Bearer');
        }
        next();
      }).catch(() => {
        res.status(401).send('Unauthorized');
      });
    return false;
  };
}

module.exports = authentication;
