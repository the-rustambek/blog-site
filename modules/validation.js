const Joi = require("joi")

module.exports = {
    SignUpValidation: Joi.object({
        
        email:Joi.string().email().required().lowercase(),
        password: Joi.string().min(4).required(),
    }),

    LoginValidation: Joi.object({
        email:Joi.string().email().required().lowercase(),
        password: Joi.string().min(4).required(),
    }),

};
