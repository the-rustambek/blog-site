const Joi = require("joi")

module.exports = {
    SignUpValidation: Joi.object({
        fullname:Joi.string().min(3).required(),
        email:Joi.string().email().required(),
        password: Joi.string().min(4).required(),
    }),
    LoginValidation: Joi.object({
        email:Joi.string().email().required(),
        password: Joi.string().min(4).required(),
    }),
};
