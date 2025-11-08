import { StatusCodes } from 'http-status-codes';
import { Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';

/**
 * middleware schema validation wrapper using joi schema for express
 * 
 * @param {Object} schema - joi schema to validate against
 * @param {String} property - request property to validate (body, params, query)
 * @returns {Function} - express middleware function 
 */
export const validateRequest = (schema: ObjectSchema, property: string = 'body') => {
    return (req: any, res: Response, next: NextFunction) => {
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
         return res.status(StatusCodes.BAD_REQUEST).json({
            status: 'error',
            message: 'Validation Error',
            errors: errorDetails
        });
    };
};