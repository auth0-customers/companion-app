var express = require('express');
var router = express.Router();
var passport = require('passport');

// Perform the login, after login Auth0 will redirect to callback
router.get('/login', passport.authenticate('auth0', {
  audience: 'http://api.com/api',
  scope: 'openid email profile'
}), function (req, res) {
  res.redirect('/');
});

// Perform the final stage of authentication and redirect to previously requested URL or '/user'
router.get('/callback', function (req, res, next) {
  passport.authenticate('auth0', function (err, user, info) {
    if (err) { return next(err); }
    console.log(info);
    if (info === 'unauthorized') return res.render('error', {
      message: 'Unauthorized',
      error: {
        status: 401
      }
    });
    if (!user) { return res.redirect('/login'); }
    req.logIn(user, function (err) {
      if (err) { return next(err); }
      const returnTo = req.session.returnTo;
      delete req.session.returnTo;
      res.redirect(returnTo || '/user');
    });
  })(req, res, next);
});

// Perform session logout and redirect to homepage
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect(`https://${process.env.AUTH0_DOMAIN}/v2/logout?returnTo=http://localhost:3001`);
});

module.exports = router;
