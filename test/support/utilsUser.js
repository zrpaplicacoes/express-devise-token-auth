const axios = require('axios');

const deviseServer = 'localhost:3000';

const userData = {
  'email': `zrp${Date.now()}@zrp.com.br`,
  'password': 'zrp@1234',
  'password_confirmation': 'zrp@1234',
  'confirm_success_url': '',
};

function createUser() {
  return axios.post(`${deviseServer}/v1/auth/indicator`, userData)
    .then((response) => {
      console.log(response.headers);
    })
    .catch((err) => {
      console.error(err);
    });
};

module.exports = {
  createUser,
};
