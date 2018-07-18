const app = require('express')();
const authentication = require('../../index');

const customAuth ={
  deviseURL: 'https://myapi.com.br:443',
  deviseScope: 'v1',
  deviseFor: 'indicator',
};

app.use(authentication(customAuth));

app.get('/', (req, res) => {
  res.send(req.user);
});

module.exports = app;
