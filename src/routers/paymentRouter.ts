import { Router, IRouter } from "express";
import validateSchema from "../middlewares/schemaMiddleware";
import * as cardMiddlewares from "../middlewares/cardMiddlewares";
import { paymentSchema } from "../schemas/paymentSchema";
import { postPayment } from "../controllers/paymentControllers";

const paymentRouter: IRouter = Router();

paymentRouter.post(
  "/payments",
  validateSchema(paymentSchema),
  cardMiddlewares.findCard,
  cardMiddlewares.verifyActive,
  cardMiddlewares.validateExpirationDate,
  cardMiddlewares.validateBlock,
  cardMiddlewares.validatePassword,
  postPayment
);

export default paymentRouter;
