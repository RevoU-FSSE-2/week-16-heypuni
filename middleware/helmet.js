const helmet = require('helmet')

const helmet = (app) => {
    app.use(helmet());
    app.use(
        helmet({
            xFrameOptions: {action: "deny"},
            crossOriginEmbedderPolicy: true,
        })
    );
};

module.exports = helmet