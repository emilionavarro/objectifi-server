var express = require('express');
var passport = require('passport');
var router = express.Router();

var libs = process.cwd() + '/libs/';

var log = require(libs + 'log')(module);
var User = require(libs + 'model/user');
var Client = require(libs + 'model/client');

var db = require(libs + 'db/mongoose');
var UserStorage = require(libs + 'model/userStorage');

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

            res.statusCode = 200;
            return res.json({
                status: "User created. Please login"
            });
        } else {
            log.error(err);
            return res.json(err.errmsg);
        }
    });
});

router.post('/storage', passport.authenticate('bearer', { session: false }), function(req, res) {
    
    UserStorage.findOne( { owner: req.user.username }, function (err, userStorage) {
        if (userStorage) {
            //send error, already exists
            res.statusCode = 409;

            return res.json({
                error: 'User storage already exists'
            });
        }

        if (!err) {
            //doesn't exist, create it

            userStorage = new UserStorage({
                owner: req.user.username,
                subscriptions: []
            });

            userStorage.save(function (err) {
                if (!err) {
                    log.info('New user storage created');

                    return res.json({
                        status: 'OK',
                        userStorage: userStorage
                    });
                } else {
                    res.statusCode = 500;
                    log.error('Internal error(%d): %s', res.statusCode, err.message);
                    
                    return res.json({
                        error: 'Server error'
                    });
                }
            })
        } else {
            res.statusCode = 500;
            log.error('Internal error(%d): %s', res.statusCode, err.message);
            
            return res.json({
                error: 'Server error'
            });
        }
    })

});

router.get('/storage', passport.authenticate('bearer', { session: false }), function (req, res) {

    UserStorage.findOne( { owner: req.user.username }, { }, function (err, userStorage) {
        if (!userStorage) {
            res.statusCode = 404;

            return res.json({
                error: 'Not found'
            });
        }

        if (!err) {
            userStorage.checkSubArrays();

            return res.json({
                status: 'OK',
                userStorage: userStorage
            })
        } else {
            res.statusCode = 500;
            log.error('Internal error(%d): %s', res.statusCode, err.message);
            
            return res.json({
                error: 'Server error'
            });
        }
    })
});

module.exports = router;
