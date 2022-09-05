import Joi, { ObjectSchema } from "joi";

export const newCardSchema: ObjectSchema = Joi.object({
  type: Joi.string()
    .valid("groceries", "restaurants", "transport", "education", "health")
    .required(),
  employeeId: Joi.number().required(),
});

export const activateCardSchema: ObjectSchema = Joi.object({
  number: Joi.string()
    .pattern(/\d{16}/)
    .required(),
  cardholderName: Joi.string().required(),
  expirationDate: Joi.string()
    .pattern(/^(0[1-9]|1[0-2])\/?([0-9]{2})/)
    .required(),
  securityCode: Joi.string().pattern(/\d{3}/).required(),
  password: Joi.string().pattern(/\d{4}/).required(),
});

export const blockCardSchema: ObjectSchema = Joi.object({
  password: Joi.string().pattern(/\d{4}/).required(),
});
