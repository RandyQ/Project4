const mongoose = require('mongoose');
// Require library to hash and salt pw
const crypto = require('crypto');

// Mongoose schema for a user
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    hash: String,
    salt: String
});

// Hashes and salts the password upon registration
userSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

// Check to see if saved hash matches hash of entered pw
userSchema.methods.validPassword = function (password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
    return this.hash === hash;
};

mongoose.model('User', userSchema);