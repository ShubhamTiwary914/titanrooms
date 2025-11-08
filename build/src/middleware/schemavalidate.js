"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const http_status_codes_1 = require("http-status-codes");
/**
 * middleware schema validation wrapper using joi schema for express
 *
 * @param {Object} schema - joi schema to validate against
 * @param {String} property - request property to validate (body, params, query)
 * @returns {Function} - express middleware function
 */
const validateRequest = (schema, property = 'body') => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req[property], {
            abortEarly: false,
            stripUnknown: true,
            errors: {
                wrap: {
                    label: false
                }
            }
        });
        if (!error) {
            req[property] = value;
            return next();
        }
        //error format (if error)
        const errorDetails = error.details.map(detail => ({
            path: detail.path.join('.'),
            message: detail.message
        }));
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            status: 'error',
            message: 'Validation Error',
            errors: errorDetails
        });
    };
};
exports.validateRequest = validateRequest;
