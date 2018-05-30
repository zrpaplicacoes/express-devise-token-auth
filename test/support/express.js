const app = require('express')();
const {authentication, customAuth} = require('../../index');

customAuth({
  deviseURL: 'http://localhost:3000',
  deviseScope: 'v1',
  deviseFor: 'indicator',
});

app.use(authentication);

app.get('/', (req, res) => {
  res.send(req.user);
});

app.listen(8080);

module.exports = app;
