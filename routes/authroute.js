const { Router } = require('express')
const { register, login, logout, passwordResetRequest, passwordReset } = require('../controllers/users')
const { loginLimiter } = require('../middleware/ratelimit')

const authRoute = Router()

authRoute.post('/register', register)
authRoute.post('/login', loginLimiter, login)
authRoute.post('/logout', logout)
authRoute.post('/passwordResetRequest', passwordResetRequest)
authRoute.post('/passwordReset', passwordReset)

module.exports = authRoute;