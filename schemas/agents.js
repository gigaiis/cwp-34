const Joi = require('joi');

module.exports = {
    id: Joi.number(),
    name: Joi.string().min(1),
    email: Joi.string().email(),
    tel: Joi.string().min(1)
};