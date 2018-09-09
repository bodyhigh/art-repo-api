import Joi from 'joi';
require ('dotenv').config();

// Define validation for all env vars
const envVarsSchema = Joi.object({
	NODE_ENV: Joi.string()
		.allow(['development', 'production', 'test'])
		.default('development'),
	PORT: Joi.number()
		.default(3000),
	MONGOOSE_DEBUG: Joi.boolean()
		.when('NODE_ENV', {
			is: Joi.string().equal('development'),
			then: Joi.boolean().default(true),
			otherwise: Joi.boolean().default(false)
		}),
	ENCRYPTION_SALT_ROUNDS: Joi.number()
		.default(10),
	JWT_SECRET: Joi.string().required()
		.description('JWT Secret required to sign'),
	MONGO_HOST: Joi.string().required()
		.description('Mongo DB host url'),
	MONGO_PORT: Joi.number()
        .default(27017),
    MONGO_USER: Joi.string().required()
        .description('Mongo Username is required'),
    MONGO_PASS: Joi.string().required()
        .description('Mongo Password is required'),
    AWS_ACCESS_KEY_ID: Joi.string().required()
        .description('AWS Access Key Id is Required'),
    AWS_SECRET_ACCESS_KEY: Joi.string().required()
        .description('AWS Secret Access Key is Required'),
    AWS_S3_BUCKETNAME: Joi.string().required()
        .description('AWS S3 Bucket Name is Required')
}).unknown()
	.required();

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema);

if (error) {
	throw new Error(`Config validation error: ${error.message}`);
}

const config = {
	env: envVars.NODE_ENV,
	port: envVars.PORT,
	mongooseDebug: envVars.MONGOOSE_DEBUG,
	encryptionSaltRounds: envVars.ENCRYPTION_SALT_ROUNDS,
	jwtSecret: envVars.JWT_SECRET,
	mongo: {
		host: envVars.MONGO_HOST,
        port: envVars.MONGO_PORT,
        user: envVars.MONGO_USER,
        pass: envVars.MONGO_PASS
    },
    aws: {
        accessKeyId : envVars.AWS_ACCESS_KEY_ID,
        secretAccessKey : envVars.AWS_SECRET_ACCESS_KEY,
        s3BucketName : envVars.AWS_S3_BUCKETNAME
    }
};

// Changes if running under TEST
if (envVars.NODE_ENV.toUpperCase() === 'TEST') {
    config.mongo.host = `${config.mongo.host}-TEST`;
}

export default config;
