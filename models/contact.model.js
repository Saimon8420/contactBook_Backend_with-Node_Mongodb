const Joi = require('joi');
const mongoose = require('mongoose');

// Create contact schema
const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    phone: {
        type: Number,
        require: true,
    },
    address: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
    },
    postedBy: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    }
});

const Contact = mongoose.model('Contact', contactSchema);

const validateContact = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(4).max(25).required(),
        email: Joi.string().email().required(),
        address: Joi.string().min(5).max(40).required(),
        phone: Joi.string().length(11).regex(/^\d+$/),
    })
    return schema.validate(data);
}

module.exports = { Contact, validateContact };