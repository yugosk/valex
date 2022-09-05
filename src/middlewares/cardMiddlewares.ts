import { Request, Response, NextFunction } from "express";
import { findById } from "../repositories/employeeRepository";
import * as cardRepository from "../repositories/cardRepository";
import * as encryptionServices from "../services/encryptionServices";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { errorDetails } from "../services/errorServices";

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
      throw "err_employee_not_found";
    }
    res.locals.employee = employee;
    next();
  } catch (err: any) {
    const error = errorDetails(err);
    res.status(error.code).send(error.message);
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
      throw "err_employee_card";
    }
    next();
  } catch (err: any) {
    const error = errorDetails(err);
    res.status(error.code).send(error.message);
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
      throw "err_card_info";
    }

    res.locals.card = card;
    next();
  } catch (err: any) {
    const error = errorDetails(err);
    res.status(error.code).send(error.message);
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
      throw "err_security_code";
    }

    if (card.password) {
      throw "err_activated";
    }

    next();
  } catch (err: any) {
    const error = errorDetails(err);
    res.status(error.code).send(error.message);
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
      throw "err_expired";
    }

    next();
  } catch (err: any) {
    const error = errorDetails(err);
    res.status(error.code).send(error.message);
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
      throw "err_card_id";
    }
    res.locals.card = card;
    res.locals.id = id;
    next();
  } catch (err: any) {
    const error = errorDetails(err);
    res.status(error.code).send(error.message);
  }
}

export async function validateBlock(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const card: cardRepository.Card = res.locals.card;
    if (card.isBlocked) {
      throw "err_blocked";
    }
    next();
  } catch (err: any) {
    const error = errorDetails(err);
    res.status(error.code).send(error.message);
  }
}

export async function validateUnblock(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const card: cardRepository.Card = res.locals.card;
    if (!card.isBlocked) {
      throw "err_blocked";
    }

    next();
  } catch (err: any) {
    const error = errorDetails(err);
    res.status(error.code).send(error.message);
  }
}

export async function validatePassword(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { password } = req.body;
  const card: cardRepository.Card = res.locals.card;

  try {
    if (encryptionServices.compareHash(password, card.password)) {
      next();
    } else {
      throw "err_password";
    }
  } catch (err: any) {
    const error = errorDetails(err);
    res.status(error.code).send(error.message);
  }
}

export async function verifyActive(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const card: cardRepository.Card = res.locals.card;

  try {
    if (card.password) {
      next();
    } else {
      throw "err_unactivated";
    }
  } catch (err) {
    const error = errorDetails(err);
    res.status(error.code).send(error.message);
  }
}

export async function findCard(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { cardId } = req.body;
  try {
    const card: cardRepository.Card = await cardRepository.findById(
      Number(cardId)
    );
    if (!card) {
      throw "err_card_id";
    }
    res.locals.card = card;
    next();
  } catch (err: any) {
    const error = errorDetails(err);
    res.status(error.code).send(error.message);
  }
}
