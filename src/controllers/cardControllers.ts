import { Request, Response } from "express";
import * as cardServices from "../services/cardServices";
import { Employee } from "../repositories/employeeRepository";
import { getCompany } from "../services/companyServices";
import { errorDetails } from "../services/errorServices";

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
    const error = errorDetails(err);
    res.status(error.code).send(error.message);
  }
}

export async function activateCard(req: Request, res: Response) {
  const { id } = res.locals.card;
  const { password } = req.body;

  try {
    cardServices.activateCard(id, password);
    res.status(201).send("Card activated succesfully");
  } catch (err: any) {
    const error = errorDetails(err);
    res.status(error.code).send(error.message);
  }
}

export async function getBalance(req: Request, res: Response) {
  const id = res.locals.id;
  try {
    const response = await cardServices.getBalance(Number(id));
    res.send(response);
  } catch (err: any) {
    const error = errorDetails(err);
    res.status(error.code).send(error.message);
  }
}

export async function blockCard(req: Request, res: Response) {
  const id = res.locals.id;
  try {
    await cardServices.blockCard(id);
    res.status(200).send("Card blocked succesfully");
  } catch (err: any) {
    const error = errorDetails(err);
    res.status(error.code).send(error.message);
  }
}

export async function unblockCard(req: Request, res: Response) {
  const id = res.locals.id;
  try {
    await cardServices.unblockCard(id);
    res.status(200).send("Card unblocked succesfully");
  } catch (err: any) {
    const error = errorDetails(err);
    res.status(error.code).send(error.message);
  }
}
