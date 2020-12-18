const User = require('../models/user');

// Read

const readAll = (req, res, next) => {
    User.find()
        .then(response => {
            res.json(
                response
            );
        })
        .catch(err => {
            res.json({
                message: 'An error occured!',
                err
            });
        });
};

const readOne = (req, res, next) => {
    let userID = req.body.userID;
    User.findById(userID)
        .then(response => {
            res.json(
                response
            );
        })
        .catch(err => {
            res.json({
                message: 'An error occured!',
                err
            });
        });
};

// Update

const update = (req, res, next) => {
    let userID = req.body.userID;

    let updatedData = {
        departure: req.body.departure,
        arrival: req.body.arrival,
        cities: req.body.cities
    };

    User.findByIdAndUpdate(userID, {
            $set: updatedData
        })
        .then(() => {
            res.json({
                message: 'User updated successful!y!'
            });
        })
        .catch(err => {
            res.json({
                message: 'An error occured!',
                err
            });
        });
};

module.exports = {
    readAll,
    readOne,
    update
}