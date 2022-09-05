import { Request, Response, NextFunction } from "express";
import { findById } from "../repositories/employeeRepository";
import * as cardRepository from "../repositories/cardRepository";
import * as encryptionServices from "../services/encryptionServices";
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
    const decryptedCVV = encryptionServices.decryptSecurityCode(
      card.securityCode
    );

    if (decryptedCVV !== securityCode) {
      return res.status(401).send("Incorrect security code");
    }

    if (card.password) {
      return res.status(409).send("Card already activated");
    }

    next();
  } catch (err) {
    res.status(500).send(err);
  }
}

export async function validateExpirationDate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const card: cardRepository.Card = res.locals.card;

  try {
    const expirationDate = dayjs(card.expirationDate, "MM/YY");
    if (expirationDate.isBefore(dayjs())) {
      return res.status(410).send("Card expired");
    }

    next();
  } catch (err) {
    res.status(500).send(err);
  }
}

export async function validateId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;
  try {
    const card: cardRepository.Card = await cardRepository.findById(Number(id));
    if (!card) {
      return res.status(404).send("Invalid card id");
    }
    res.locals.card = card;
    res.locals.id = id;
    next();
  } catch (err) {
    res.status(500).send(err);
  }
}

export async function validateBlock(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const card: cardRepository.Card = res.locals.card;
  if (card.isBlocked) {
    return res.status(409).send("Card is already blocked");
  }

  next();
}

export async function validateUnblock(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const card: cardRepository.Card = res.locals.card;
  if (!card.isBlocked) {
    return res.status(409).send("Card is already unblocked");
  }

  next();
}

export async function validatePassword(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { password } = req.body;
  const card: cardRepository.Card = res.locals.card;

  if (encryptionServices.compareHash(password, card.password)) {
    next();
  } else {
    return res.status(401).send("Incorrect password");
  }
}
