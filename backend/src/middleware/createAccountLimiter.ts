import rateLimit from 'express-rate-limit';

export const createAccountLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        errors: ['Too many accounts created from this IP, please try again after 15 minutes'],
    },
});
