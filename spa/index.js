const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const app = express();
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');

dotenv.config({ silent: process.env.NODE_ENV === 'production' });

const forceMimeType = (res, path) => {
  console.log('path: ', path);
  if (path.endsWith('apple-app-site-association')) {
    res.type('application/json');
  }
};

app.use(express.static(path.join(__dirname, 'build')));
app.use('/.well-known', express.static(path.join(__dirname, '.well-known'), {
  setHeaders: forceMimeType
}));

const jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
  }),
  audience: 'http://api.com/api',
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ['RS256']
});

app.get('/nologin', jwtCheck, function(req, res) {
  console.log('Carlos, did it!');
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


const port = process.env.PORT || 3000;
app.listen(port, (err) => {
  'use strict';
  if (err) console.error(err);
  else console.log('Started on port ', port);
});
