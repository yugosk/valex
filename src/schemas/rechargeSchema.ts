import Joi, { ObjectSchema } from "joi";

export const rechargeSchema: ObjectSchema = Joi.object({
  amount: Joi.number().greater(0),
});
