var express = require('express');
var secured = require('../lib/middleware/secured');
var router = express.Router();
const request = require('request');

const displayHelpdeskPage = (message, lastUser, req, res) => {
  request.get({
    url: 'http://localhost:8080/users',
    json: true,
    headers: {
      Authorization: `Bearer ${req.user.accessToken}`
    }
  }, function(error, response, users) {
    if (error) console.error(error);

    const targetUsers = users.filter((targetUser) => {
      return targetUser.email !== req.user._json.email;
    });

    res.render('helpdesk', {
      user: req.user,
      users: targetUsers,
      lastUser,
      title: 'Helpdesk',
      message
    });
  });
};

/* GET user profile. */
router.get('/helpdesk', secured(), function(req, res, next) {
  displayHelpdeskPage('', undefined, req, res);
});

router.post('/helpdesk', secured(), function(req, res, next) {
  if (req.body.something) {
    if (req.body.something === 'do') {
      return request.post({
        url: 'http://localhost:8080/something',
        json: {
          user_id: req.body.target_user_id
        },
        headers: {
          Authorization: `Bearer ${req.user.accessToken}`
        }
      }, (err, response, body) => {
        if (err) console.log(err);

        displayHelpdeskPage('did something: ' + JSON.stringify(body), req.body.target_user_id, req, res);
      });
    }
    else if (req.body.something === 'read') {
      return request.get({
        url: 'http://localhost:8080/something',
        json: true,
        headers: {
          Authorization: `Bearer ${req.user.accessToken}`
        },
        qs: {
          user_id: req.body.target_user_id
        }
      }, (err, response, body) => {
        if (err) console.log(err);

        displayHelpdeskPage('read something: ' + JSON.stringify(body), req.body.target_user_id, req, res);
      });
    }
  }

  displayHelpdeskPage('did or read nothing', req, res);
});

module.exports = router;
