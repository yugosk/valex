import { Request, Response } from "express";
import { getCompany } from "../services/companyServices";
import { RechargeInsertData } from "../repositories/rechargeRepository";
import { recharge } from "../services/rechargeServices";
import { errorDetails } from "../services/errorServices";

export async function rechargeCard(req: Request, res: Response) {
  const apiKey: any = req.headers["x-api-key"];
  const { id } = req.params;
  const { amount } = req.body;
  const rechargeData: RechargeInsertData = {
    cardId: Number(id),
    amount: amount,
  };

  try {
    await getCompany(apiKey);
    await recharge(rechargeData);
    res.status(201).send("Recharge made succesfully");
  } catch (err: any) {
    const error = errorDetails(err);
    res.status(error.code).send(error.message);
  }
}
