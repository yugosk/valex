import { Router, IRouter } from "express";
import validateSchema from "../middlewares/schemaMiddleware";
import * as cardSchemas from "../schemas/cardSchema";
import * as cardControllers from "../controllers/cardControllers";
import * as cardMiddlewares from "../middlewares/cardMiddlewares";

const cardRouter: IRouter = Router();

cardRouter.post(
  "/cards",
  validateSchema(cardSchemas.newCardSchema),
  cardMiddlewares.validateEmployee,
  cardMiddlewares.validateType,
  cardControllers.newCard
);

cardRouter.post(
  "/cards/activate",
  validateSchema(cardSchemas.activateCardSchema),
  cardMiddlewares.validateCardDetails,
  cardMiddlewares.validateCardActivation,
  cardControllers.activateCard
);

cardRouter.get(
  "/cards/balance/:id",
  cardMiddlewares.validateId,
  cardControllers.getBalance
);

export default cardRouter;
