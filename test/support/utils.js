const axios = require('axios');

const {deviseURL, deviseScope, deviseFor} = require('./variables');

const userData = {
  'email': `zrp${Date.now()}@zrp.com.br`,
  'password': 'zrp@1234',
  'password_confirmation': 'zrp@1234',
  'confirm_success_url': '',
};

function createUser() {
  return axios.post(`${deviseURL}/${deviseScope}/auth/${deviseFor}`, userData)
    .then((response) => {
      return (response.headers);
    })
    .catch((err) => {
      console.error(err);
    });
};

module.exports = {
  createUser,
};
