import config from './config/config';
import app from './config/express';
import mongoose from 'mongoose';

Promise = require('bluebird');

// MONGOOSE
const mongoUri = config.mongo.host;
const options = {
    user: config.mongo.user,
    pass: config.mongo.pass,
    useNewUrlParser: true,
    keepAlive: true
};

mongoose.Promise = Promise;
mongoose.connect(mongoUri, options);
mongoose.connection.on('error', () => {
    throw new Error(`Unable to connect to database: ${mongoUri}`);
});


// START LISTENING
if (!module.parent) {
    app.listen(config.port, () => {
        console.info(`server started on port ${config.port} (${config.env})`);
    });
}

export default app;