import validator from 'email-validator';

/**
 * Middleware to check if the email is valid.
 */
const validateEmail = () => {
    return async function (req, res, next) {
        const email = req.body.email;
        if (!email) {
            return res.status(400).send('Email is required!');
        }
        const isValid = validator.validate(email);

        if (!isValid) {
            return res.status(400).send('Invalid email. Please enter a valid email address')
        }
        next()
    }
}

export default validateEmail