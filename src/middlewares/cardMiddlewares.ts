import { Request, Response, NextFunction } from "express";
import { findById } from "../repositories/employeeRepository";
import * as cardRepository from "../repositories/cardRepository";
import { decryptSecurityCode } from "../services/encryptionServices";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

export async function validateEmployee(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { employeeId } = req.body;
  try {
    const employee = await findById(employeeId);
    if (!employee) {
      return res.status(404).send("Employee ID is not valid");
    }
    res.locals.employee = employee;
    next();
  } catch (err) {
    res.status(500).send(err);
  }
}

export async function validateType(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { type, employeeId } = req.body;
  try {
    const isValid = await cardRepository.findByTypeAndEmployeeId(
      type,
      employeeId
    );
    if (isValid) {
      return res
        .status(409)
        .send("This employee already has a card of this type");
    }
    next();
  } catch (err) {
    res.status(500).send(err);
  }
}

export async function validateCardDetails(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { number, cardholderName, expirationDate } = req.body;
  try {
    const card = await cardRepository.findByCardDetails(
      number,
      cardholderName,
      expirationDate
    );

    if (!card) {
      return res.status(404).send("Invalid card info");
    }

    res.locals.card = card;
    next();
  } catch (err) {
    res.status(500).send(err);
  }
}

export async function validateCardActivation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { securityCode } = req.body;
  const card: cardRepository.Card = res.locals.card;

  try {
    const decryptedCVV = decryptSecurityCode(card.securityCode);

    if (decryptedCVV !== securityCode) {
      return res.status(401).send("Incorrect security code");
    }

    const expirationDate = dayjs(card.expirationDate, "MM/YY");
    if (expirationDate.isBefore(dayjs())) {
      return res.status(410).send("Card expired");
    }

    if (card.password) {
      return res.status(409).send("Card already activated");
    }

    next();
  } catch (err) {
    res.status(500).send(err);
  }
}
