const app = require('express')();
const {authentication, customAuth} = require('../../index');

customAuth({
  deviseURL: 'https://localhost:3000',
  deviseScope: 'v1',
  deviseFor: 'indicator',
});

app.use(authentication);

app.get('/', (req, res) => {
  res.send(req.user);
});

module.exports = app;
