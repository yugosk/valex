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
    const id = await cardServices.newCard(newCard);
    const response = {
      id,
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
    res.status(500).send(err);
  }
}

export async function getBalance(req: Request, res: Response) {
  const id = res.locals.id;
  try {
    const response = await cardServices.getBalance(Number(id));
    res.send(response);
  } catch (err) {
    res.status(500).send(err);
  }
}
