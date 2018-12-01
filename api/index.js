const express = require('express');
const app = express();
const jwt = require('express-jwt');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwks = require('jwks-rsa');
const jwtAuthz = require('express-jwt-authz');
const middlewares = require('auth0-extension-express-tools').middlewares;
const dotenv = require('dotenv');

const ADMIN = 'admin';
const USER = 'user';

dotenv.config();

app.use(cors({
  origin: 'http://localhost:3000'
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const port = process.env.PORT || 8080;

const managementClient = middlewares.managementApiClient({
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET
});

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

/**
 * NOTE: This is not a great solution here, just a demo of what kind of things could be done.  This is not
 * production ready code.
 */
const hasRole = function(user, role) {
  return user['http://claims.com/role'] === role;
} ;

const checkRole = function(role) {
  return function(req, res, next) {
    if (!hasRole(req.user, role))
      return res.status(403).json({
        message: `You are not permitted to perform this action`,
        status: 403
      });
    next();
  };
};

/**
 * NOTE: This is not a great solution here, just a demo of what kind of things could be done.  This is not
 * production ready code.
 */
const checkSelfOrAdmin = function(req, res, next) {
  const targetUser = req.query.user_id || req.body.user_id;
  if (targetUser === req.user.sub) return next();
  if (!targetUser) return res.status(400).json({
    message: `Bad Request, must state which user this action is for`,
    status: 400
  });
  if (!hasRole(req.user, ADMIN))
    return res.status(403).json({
      message: `You are not permitted to perform this action for ${targetUser}`,
      status: 403
    });
  next();
};

app.use(jwtCheck);
app.use(function(req, res, next) {
  req.user.email = req.user['http://claims.com/email'];
  next();
});

app.get('/users', checkRole(ADMIN), managementClient, function(req, res) {
  req.auth0.users.getAll()
    .then(users => res.json(users))
    .catch(err => res.send(err));
});

app.get('/something', checkSelfOrAdmin, function(req, res) {
  console.log(req.query);
  if (req.query.user_id !== req.user.sub) {
    return res.json({
      message: `${req.user.email} read something for ${req.query.user_id}`,
      user: req.user
    });
  }

  return res.json({
    message: `Read something for ${req.user.sub}`,
    user: req.user
  });

});

app.post('/something', checkSelfOrAdmin, function(req, res) {
  if (req.body.user_id !== req.user.sub) {
    return res.json({
      message: `${req.user.email} did something for ${req.body.user_id}`,
      user: req.user
    });
  }

  return res.json({
    message: `Did something for ${req.user.sub}`,
    user: req.user
  })
});


app.listen(port, () => {
  console.log(`Listening on port ${port}`)
});
