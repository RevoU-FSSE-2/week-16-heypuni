const { rateLimit } = require('express-rate-limit');

exports.loginLimiter = rateLimit({
    windowMs: 10 * 1 * 1000, // 10 seconds
    limit: 5, // Limit each IP to 5 requests per `window` (here, per 10 seconds)
    // Set `RateLimit` and `RateLimit-Policy` headers
    // Disable the `X-RateLimit-*` headers
    headers: true,
});
