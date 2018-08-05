var express = require('express');
var passport = require('passport');
var router = express.Router();

router.get('/', passport.authenticate('bearer', { session: false }), function (req, res) {
    res.json({
        msg: 'API is running'
    });
});

router.get('/getcontainers', function (req, res) {
    res.json(CONTAINERS);
})

module.exports = router;

const CONTAINERS = [
    {
        id: 0,
        name: "Computer Parts",
        description: "A container with item parts and their purchase dates",
        containerType: "historical",
        items: [
            {
                name: "cpu",
                fields: [
                    {
                        fieldName: "date",
                        value: "1/1/2018"
                    },
                    {
                        fieldName: "price",
                        value: 300
                    }
                ]
            },
            {
                name: "Ram",
                fields: [
                    {
                        fieldName: "date",
                        value: "1/1/2018"
                    },
                    {
                        fieldName: "price",
                        value: 120
                    }
                ]
            }
        ]
    }
]