var express = require('express');
var passport = require('passport');
var router = express.Router();

var libs = process.cwd() + '/libs/';

var log = require(libs + 'log')(module);
var User = require(libs + 'model/user');
var Client = require(libs + 'model/client');

var db = require(libs + 'db/mongoose');

router.get('/info', passport.authenticate('bearer', { session: false }),
    function (req, res) {
        // req.authInfo is set using the `info` argument supplied by
        // `BearerStrategy`. It is typically used to indicate scope of the token,
        // and used in access control checks. For illustrative purposes, this
        // example simply returns the scope in the response.
        res.json({
            user_id: req.user.userId,
            name: req.user.username,
            scope: req.authInfo.scope
        });
    }
);

router.post('/signup', function (req, res) {
    var user = new User({
        username: req.body.username,
        password: req.body.password
    });

    //check for users before doing this

    user.save(function (err, user) {
        if (!err) {
            log.info('New user - %s:%s', user.username, user.password);
        } else {
            log.error(err);
            return res.json(err.errmsg);
        }
    });
})

module.exports = router;
