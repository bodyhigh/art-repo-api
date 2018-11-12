const { validationResult } = require('express-validator/check');

exports.reqResultsHandler = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.json({ 
            success: false, 
            errorCode: 'INVALID_REQUEST_PARAMETERS', 
            message: errors.array() 
        });
    
        // next(new APIError('Failed Parameter Validation', httpStatus.BAD_REQUEST));
    } else {
        next();
    }
}