const cors = require("./cors");
const database = require("./database");
const helmet = require("./helmet");
const morgan = require("./morgan");
const req = require("./req");
const bodyParser = require("./bodyParser");
const cookieParser = require("./cookieParser");

const useMiddleware = (app) => {
    morgan(app);
    bodyParser(app);
    app.use(req);
    helmet(app);
    cors(app);
    cookieParser(app);
    app.use(database);
}

module.exports = useMiddleware;