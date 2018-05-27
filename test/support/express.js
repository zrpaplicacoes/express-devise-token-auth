const app = require('express')();
const {authentication} = require('../../index');

app.use(authentication);

app.get('/', (req, res) => {
  res.send('ok');
});

app.listen(8080);

module.exports = app;
