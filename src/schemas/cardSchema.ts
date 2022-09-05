import Joi from "joi";

export const newCardSchema = Joi.object({
  type: Joi.string()
    .valid("groceries", "restaurants", "transport", "education", "health")
    .required(),
  employeeId: Joi.number().required(),
});
