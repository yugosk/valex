import { Employee } from "../repositories/employeeRepository";
import * as cardRepository from "../repositories/cardRepository";
import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import * as encryptionServices from "./encryptionServices";

export async function newCard(card: cardRepository.CardInsertData) {
  try {
    await cardRepository.insert(card);
  } catch (err) {
    throw err;
  }
}

export async function generateCardData(
  employee: Employee,
  type: cardRepository.TransactionTypes
) {
  const cardholderName: string = cardName(employee.fullName);
  const number: string = faker.finance.creditCardNumber();
  const securityCode: string = encryptionServices.encryptSecurityCode(
    faker.finance.creditCardCVV()
  );
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
