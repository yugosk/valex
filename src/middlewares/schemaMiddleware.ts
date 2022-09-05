import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";

export default function validateSchema(schema: ObjectSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { body } = req;
    const { error } = schema.validate(body, { abortEarly: false });

    if (error) {
      res.status(422).send("Invalid format");
    }

    next();
  };
}
