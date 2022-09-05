import { Router, IRouter } from "express";
import validateSchema from "../middlewares/schemaMiddleware";
import { newCardSchema } from "../schemas/cardSchema";
import { newCard } from "../controllers/cardControllers";
import { validateEmployee, validateType } from "../middlewares/cardMiddlewares";

const cardRouter: IRouter = Router();

cardRouter.post(
  "/cards",
  validateSchema(newCardSchema),
  validateEmployee,
  validateType,
  newCard
);

export default cardRouter;
