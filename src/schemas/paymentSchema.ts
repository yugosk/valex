import Joi, { ObjectSchema } from "joi";

export const paymentSchema: ObjectSchema = Joi.object({
  cardId: Joi.number().required(),
  password: Joi.string().pattern(/\d{4}/).required(),
  businessId: Joi.number().required(),
  amount: Joi.number().greater(0).required(),
});
