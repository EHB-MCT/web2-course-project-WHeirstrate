const mongoose = require('mongoose');
const schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },

    departure: {
        type: Array
    },
    arrival: {
        type: Array
    },
    cities: {
        type: Array
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);
module.exports = User;