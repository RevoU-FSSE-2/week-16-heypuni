const cookieParser = require('cookie-parser')

const cookieParserMiddleware = (app) => {
    app.use(cookieParser())
}

module.exports = cookieParserMiddleware;