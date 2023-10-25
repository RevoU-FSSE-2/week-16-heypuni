const morgan = require('morgan')

const morgan = (app) => {
    app.use(morgan ('dev'));
}

module.exports = morgan;