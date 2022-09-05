import { Request, Response } from "express";
import { getCompany } from "../services/companyServices";
import { RechargeInsertData } from "../repositories/rechargeRepository";
import { recharge } from "../services/rechargeServices";

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
  } catch (err) {
    res.status(500).send(err);
  }
}
