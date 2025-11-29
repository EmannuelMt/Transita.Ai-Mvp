const Joi = require('joi');

const userSchema = Joi.object({
    nomeCompleto: Joi.string().min(3).optional(),
    email: Joi.string().email().optional(),
    empresa: Joi.string().optional(),
    telefone: Joi.string().optional()
});

function validateUser(data) {
    return userSchema.validate(data);
}

module.exports = { validateUser };
