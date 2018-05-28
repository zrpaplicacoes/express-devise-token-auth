const app = require('express')();
const {authentication, customAuth} = require('../../index');
const {apiPORT} = require('./variables');

customAuth({
  deviseURL: 'http://localhost:3000',
  deviseScope: 'v1',
  deviseFor: 'indicator',
});

app.use(authentication);

app.get('/', (req, res) => {
  res.send('ok');
});

app.listen(apiPORT);

module.exports = app;
