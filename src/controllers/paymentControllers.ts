import { Request, Response } from "express";
import { Card } from "../repositories/cardRepository";
import { getBusiness } from "../services/businessServices";
import { getBalance } from "../services/cardServices";
import { PaymentInsertData } from "../repositories/paymentRepository";
import { payment } from "../services/paymentServices";
import { errorDetails } from "../services/errorServices";

export async function postPayment(req: Request, res: Response) {
  const { businessId, amount } = req.body;
  const card: Card = res.locals.card;
  try {
    const business = await getBusiness(businessId);

    if (card.type !== business.type) {
      throw "err_card_type";
    }

    const { balance: balance } = await getBalance(card.id);

    if (amount > balance) {
      throw "err_insufficient_funds";
    }

    const paymentInfo: PaymentInsertData = {
      cardId: card.id,
      businessId,
      amount,
    };

    await payment(paymentInfo);
    res.status(201).send("Payment completed succesfully");
  } catch (err: any) {
    const error = errorDetails(err);
    res.status(error.code).send(error.message);
  }
}
