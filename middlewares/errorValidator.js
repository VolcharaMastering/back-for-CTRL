/**
* @module Middleware
* @file errorValidator middleware. Middleware function to validate errors.
* @exports validateLogin 
* @exports validateCreateUser
* @exports validateUserId
* @exports validateUpdateUser
*/
import { celebrate, Joi } from "celebrate";
// import { ObjectId } from 'mongoose';.Types
import validUrl from "validator/lib/isURL.js";

/**
 * Validates if the given value is a valid ObjectId.
 *
 * @param {any} value - The value to be validated.
 * @param {object} helpers - The helpers object provided by celebrate.
 * @return {any|Error} - The validated value if it is a valid ObjectId, otherwise an error.
 */
const validId = (value, helpers) => {
  if (!ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
};

/**
 * Validates a link by checking if it is a valid URL.
 * @return {string|Error} - The validated value if it is a valid name, otherwise an error.
 */
const validLink = (value, helpers) => {
  if (validUrl(value)) {
    return value;
  }
  return helpers.error("any.invalid");
};

/**
 * Validates if the given value is a valid name.
 */
const validName = (value, helpers) => {
  if (!/[а-яА-Яa-zA-Z0-9-._~:/?#@!$&'()*+,;=]+?$/.test(value)) {
    return helpers.error("any.invalid");
  }
  return value;
};
/**
 * Middleware for user validation on create.
 */
const validateCreateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8).max(40),
    username: Joi.string().required().min(2).max(30),
  }),
});

/**
 * Middleware for data validation on user login.
 */
const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

/**
 * Middleware for validation on user identification.
 */
const validateUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().custom(validId),
  }),
});

/**
 * Middleware for user validation on user update.
 */
const validateUpdateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    username: Joi.string().required().min(2).max(30),
  }),
});

export { validateLogin, validateCreateUser, validateUserId, validateUpdateUser };
