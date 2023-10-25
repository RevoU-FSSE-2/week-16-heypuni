const jwt = require('jsonwebtoken')
const { JWT_SIGN } = require('../config/jwt.js')

const authorization = (req, res, next) => {
  const authHeader = req.cookies.access_token
  
  if (!authHeader) {
    res.status(401).json({ error: 'Unauthorized' })
  } else {
    try {
      const decodedToken = jwt.verify(authHeader, JWT_SIGN)
      if (decodedToken.role === 'admin' || decodedToken.role === 'superadmin' ) {
        next()
      } else {
        res.status(401).json({ error: 'Unauthorized' })
      }
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
}

module.exports = authorization