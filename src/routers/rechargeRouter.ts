import { Router, IRouter } from "express";
import validateSchema from "../middlewares/schemaMiddleware";
import { rechargeSchema } from "../schemas/rechargeSchema";
import * as cardMiddlewares from "../middlewares/cardMiddlewares";
import { rechargeCard } from "../controllers/rechargeControllers";

const rechargeRouter: IRouter = Router();

rechargeRouter.post(
  "/recharge/:id",
  validateSchema(rechargeSchema),
  cardMiddlewares.validateId,
  cardMiddlewares.validateExpirationDate,
  cardMiddlewares.verifyActive,
  rechargeCard
);

export default rechargeRouter;
