const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = (req, res, next) => {
    bcrypt.hash(req.body.password, 10, function (err, hashedPass) {
        if (err)
            res.json({
                error: err
            });

        let user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPass,
            departure: [],
            arrival: [],
            cities: []
        });

        user.save()
            .then(user => {
                res.json({
                    message: 'User Added Succesfully!',
                    user
                });
            })
            .catch(err => {
                res.json({
                    message: `An error occured!`,
                    err
                });
            });
    });

};

const login = (req, res, next) => {
    let username = req.body.username;
    let password = req.body.password;

    User.findOne({
            $or: [{
                email: username
            }]
        })
        .then(user => {
            if (user) {
                bcrypt.compare(password, user.password, function (err, result) {
                    if (err) {
                        res.json({
                            error: err
                        });
                    }
                    if (result) {
                        let token = jwt.sign({
                            name: user.name
                        }, 'AnA.R0s()', { // secret value to confirm -> has to be the same as authenticate.js secret value
                            expiresIn: '1h'
                        });
                        console.log(result);
                        res.json({
                            message: 'Login Successful!',
                            token,
                            user
                        });
                    } else {
                        res.json({
                            message: 'Password does not match!',
                            error: 'failed'
                        });
                    }
                })
            } else {
                res.json({
                    message: 'No user found!',
                    error: 'failed'
                });
            }
        })
}

module.exports = {
    register,
    login
};