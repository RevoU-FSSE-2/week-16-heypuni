const bodyParser = require('body-parser');

const bodyParserMiddleware = (app) => {
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json())
};

module.exports = bodyParserMiddleware;