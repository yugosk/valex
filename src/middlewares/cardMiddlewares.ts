import { Request, Response, NextFunction } from "express";
import { findById } from "../repositories/employeeRepository";
import { findByTypeAndEmployeeId } from "../repositories/cardRepository";

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
    const isValid = await findByTypeAndEmployeeId(type, employeeId);
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
