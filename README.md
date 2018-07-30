# Express Devise Token Auth (WARNING: Not production ready yet!)

## Information

Express Devise Token Auth is a general middleware that adds the ability to express projects authenticate users through a [devise-token-auth](https://github.com/lynndylanhurley/devise_token_auth) micro service running with Rails.

Basically this middleware validates token information and acts like a `before_action :authenticate_user` that we have in Rails.

## Installation

```npm install express-devise-token-auth --save```

## Setup

The setup is pretty straight forward and easy, you just need to:

<ul>
  <li>Configure customAuth</li>
  <li>Use authentication</li>
</ul>

### Protecting all routes

```js
const app = require('express')();
const authentication = require('express-devise-token-auth');

const customAuth = {
  deviseURL: 'http://localhost:3000',
  deviseScope: 'v1',
  deviseFor: 'indicator',
};

app.use(authentication(customAuth))

app.get('/', (req, res) => {
  res.send(req.user);
});

app.listen(8080);

module.exports = app;

```

### Protecting just some routes


```js
const app = require('express')();
const authentication = require('express-devise-token-auth');

const adminRoutes = require('../routes');

const customAuth = {
  deviseURL: 'http://localhost:3000',
  deviseScope: 'v1',
  deviseFor: 'indicator',
};

app.get('/admin', authentication(customAuth), adminRoutes);

app.listen(8080);

module.exports = app;

```
