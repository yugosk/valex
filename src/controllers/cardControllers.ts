import { Request, Response } from "express";
import * as cardServices from "../services/cardServices";
import { Employee } from "../repositories/employeeRepository";
import { getCompany } from "../services/companyServices";

export async function newCard(req: Request, res: Response) {
  const apiKey: any = req.headers["x-api-key"];
  const employee: Employee = res.locals.employee;
  const { type } = req.body;

  try {
    await getCompany(apiKey);
    const newCard = await cardServices.generateCardData(employee, type);
    await cardServices.newCard(newCard);
    const response = {
      number: newCard.number,
      cardholderName: newCard.cardholderName,
      securityCode: newCard.securityCode,
      expirationDate: newCard.expirationDate,
      type: newCard.type,
    };

    res.status(201).send(response);
  } catch (err: any) {
    res.status(500).send(err);
  }
}

export async function activateCard(req: Request, res: Response) {
  const { id } = res.locals.card;
  const { password } = req.body;

  try {
    cardServices.activateCard(id, password);
    res.status(201).send("Card activated succesfully");
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
}

//{
//  "cardNumber": "2937457372577523",
//  "cardholderName": "CICLANA M MADEIRA",
//  "securityCode": "238",
//  "expirationDate": "09/27",
//  "type": "groceries"
//}
