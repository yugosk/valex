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
  cardMiddlewares.validateExpirationDate,
  cardMiddlewares.validateCardActivation,
  cardControllers.activateCard
);

cardRouter.get(
  "/cards/balance/:id",
  cardMiddlewares.validateId,
  cardControllers.getBalance
);

cardRouter.put(
  "/cards/block/:id",
  validateSchema(cardSchemas.blockCardSchema),
  cardMiddlewares.validateId,
  cardMiddlewares.validateExpirationDate,
  cardMiddlewares.validateBlock,
  cardMiddlewares.validatePassword,
  cardControllers.blockCard
);

cardRouter.put(
  "/cards/unblock/:id",
  validateSchema(cardSchemas.blockCardSchema),
  cardMiddlewares.validateId,
  cardMiddlewares.validateExpirationDate,
  cardMiddlewares.validateUnblock,
  cardMiddlewares.validatePassword,
  cardControllers.unblockCard
);

export default cardRouter;
