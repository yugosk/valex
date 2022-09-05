import { Employee } from "../repositories/employeeRepository";
import * as cardRepository from "../repositories/cardRepository";
import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import * as encryptionServices from "./encryptionServices";

export async function newCard(card: cardRepository.CardInsertData) {
  const newCard: cardRepository.CardInsertData = {
    ...card,
    securityCode: encryptionServices.encryptSecurityCode(card.securityCode),
  };
  try {
    await cardRepository.insert(newCard);
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
