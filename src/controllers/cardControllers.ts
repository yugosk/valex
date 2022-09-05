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
    res.status(201).send("Card created succesfully");
  } catch (err: any) {
    res.status(500).send(err);
  }
}
