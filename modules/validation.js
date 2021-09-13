const Joi = require("joi")

module.exports = {
    SignUpValidation: Joi.object({
        email:Joi.string().email().required(),
        password: Joi.string().min(4).required(),
    }),
};