const app = require('express')();
const {authentication} = require('../../index');
const {apiPORT} = require('./variables');

app.use(authentication);

app.get('/', (req, res) => {
  res.send('ok');
});

app.listen(apiPORT);

module.exports = app;
