const Joi = require('joi');
const mongoose = require('mongoose');

// Create user schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
    },
    password: {
        type: String,
        require: true,
    }
});
const User = mongoose.model('User', userSchema);

const validateUser = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(5).max(25).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required()
    })
    return schema.validate(data);
}

module.exports = { User, validateUser };