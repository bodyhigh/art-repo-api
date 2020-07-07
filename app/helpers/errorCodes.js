//@ts-check
export default {
    CREDENTIALS_REQUIRED: {
        errorCode: 'CREDENTIALS_REQUIRED',
        description: 'No authorization token was found'
    },

    INVALID_CREDENTIALS: {
        errorCode: 'INVALID_CREDENTIALS',
        description: 'Invalid login credentials'
    },

    INVALID_OWNERSHIP: {
        errorCode: 'INVALID_OWNERSHIP',
        description: 'Invalid ownership of the requested record'
    },

    INVALID_REQUEST_PARAMETERS: {
        errorCode: 'INVALID_REQUEST_PARAMETERS',
        description: 'Invalid request parameters'
    },

    INVALID_ROLE_PERMISSIONS: {
        errorCode: 'INVALID_ROLE_PERMISSIONS',
        description: 'Invalid role permissions'
    },

    REGISTER_DUPLICATE_EMAIL: {
        errorCode: 'REGISTER_DUPLICATE_EMAIL',
        description: 'Email address has already been registered'
    },
};