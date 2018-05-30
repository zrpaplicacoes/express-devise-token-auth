module.exports = {
  "extends": "google",
  "parserOptions": {
    "ecmaVersion": 8,
    "sourceType": "module",
    "ecmaFeatures": {
      "experimentalObjectRestSpread": true,
    },
  },
  "env": {
    "node": true,
    "es6": true,
  },
  "rules": {
    "require-jsdoc": 0,
    "new-cap": 0,
    "max-len": ["error", { "code": 100 }]
  }
};