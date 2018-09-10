import mongoose from 'mongoose'
// import config from '../config/config';
import app from '../server';

// describe('SETUP GLOBALS', () => {
    // before((done) => {
    //     Promise = require('bluebird');
    //     const mongoUri = config.mongo.host;
    //     const options = {
    //         user: config.mongo.user,
    //         pass: config.mongo.pass,
    //         useNewUrlParser: true,
    //         keepAlive: true
    //     };

    //     mongoose.Promise = Promise;
    //     mongoose.connect(mongoUri, options);
    //     mongoose.connection.on('error', () => {
    //         throw new Error(`Unable to connect to database: ${mongoUri}`);
    //     });
    //     mongoose.connection.on('connected', () => {
    //         console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ CONNECTED');
    //         done();
    //     });
    // })

    after((done) => {
        mongoose.models = {};
        mongoose.modelSchemas = {};
        mongoose.connection.close();
        done();
    });
// });