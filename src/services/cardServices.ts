import { Employee } from "../repositories/employeeRepository";
import * as cardRepository from "../repositories/cardRepository";
import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import * as encryptionServices from "./encryptionServices";
import * as paymentRepository from "../repositories/paymentRepository";
import * as rechargeRepository from "../repositories/rechargeRepository";

export async function newCard(card: cardRepository.CardInsertData) {
  const newCard: cardRepository.CardInsertData = {
    ...card,
    securityCode: encryptionServices.encryptSecurityCode(card.securityCode),
  };
  try {
    const id = await cardRepository.insert(newCard);
    return id.id;
  } catch (err) {
    throw err;
  }
}

export async function generateCardData(
  employee: Employee,
  type: cardRepository.TransactionTypes
) {
  const cardholderName: string = cardName(employee.fullName);
  const number: string = faker.random.numeric(16);
  const securityCode: string = faker.finance.creditCardCVV();
  const expirationDate: string = newExpirationDate();

  const newCard: cardRepository.CardInsertData = {
    employeeId: employee.id,
    number,
    cardholderName,
    securityCode,
    expirationDate,
    isVirtual: false,
    isBlocked: true,
    type,
  };
  return newCard;
}

function cardName(name: string): string {
  const nameArray: string[] = name
    .toUpperCase()
    .split(" ")
    .filter((name) => name.length >= 3);
  return nameArray
    .map((name, index) => {
      if (index !== 0 && index !== nameArray.length - 1) {
        return name.slice(0, 1);
      } else {
        return name;
      }
    })
    .join(" ");
}

function newExpirationDate(): string {
  return dayjs().add(5, "year").format("MM/YY");
}

export async function activateCard(id: number, password: string) {
  const encryptedPassword = encryptionServices.encryptPassword(password);
  try {
    await cardRepository.update(id, encryptedPassword);
  } catch (err) {
    throw err;
  }
}

export async function getBalance(id: number) {
  try {
    const transactions = await paymentRepository.findByCardId(id);
    const recharges = await rechargeRepository.findByCardId(id);
    const balance = sumBalance(transactions, recharges);
    const response = {
      balance,
      transactions,
      recharges,
    };
    return response;
  } catch (err) {
    throw err;
  }
}

function sumBalance(payments: any, recharges: any) {
  let balance: number = 0;
  for (let i = 0; i < recharges.length; i++) {
    balance = balance + recharges[i].amount;
  }

  for (let i = 0; i < payments.length; i++) {
    balance = balance - payments[i].amount;
  }

  return balance;
}
