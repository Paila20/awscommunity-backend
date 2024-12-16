const Joi = require('joi');

const passwordRegex =  /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
const signupValidation = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(100).required(),
        email: Joi.string().email().pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).required(),
        password: Joi.string().min(8).pattern(passwordRegex).required()
    });
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400)
            .json({ message: "Bad request", error })
    }
    next();
}
const loginValidation = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).required(),
        password: Joi.string().min(8).pattern(passwordRegex).required()
    });
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400)
            .json({ message: "Bad request", error })
    }
    next();
}
module.exports = {
    signupValidation,
    loginValidation
}