import { Request, Response } from "express";
import { Card } from "../repositories/cardRepository";
import { getBusiness } from "../services/businessServices";
import { getBalance } from "../services/cardServices";
import { PaymentInsertData } from "../repositories/paymentRepository";
import { payment } from "../services/paymentServices";

export async function postPayment(req: Request, res: Response) {
  const { businessId, amount } = req.body;
  const card: Card = res.locals.card;
  try {
    const business = await getBusiness(businessId);

    if (card.type !== business.type) {
      return res
        .status(401)
        .send("This card type does not match the business's");
    }

    const { balance: balance } = await getBalance(card.id);

    if (amount > balance) {
      return res
        .status(402)
        .send(
          "This card does not has the necessary amount to complete the purchase"
        );
    }

    const paymentInfo: PaymentInsertData = {
      cardId: card.id,
      businessId,
      amount,
    };

    await payment(paymentInfo);
    res.status(201).send("Payment completed succesfully");
  } catch (err) {
    res.status(500).send(err);
  }
}
