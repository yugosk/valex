import { Business, findById } from "../repositories/businessRepository";

export async function getBusiness(businessId: number) {
  try {
    const business: Business = await findById(businessId);

    if (!business) {
      throw "err_invalid_businessId";
    } else {
      return business;
    }
  } catch (err) {
    if (err === "err_invalid_businessId") {
      throw { code: 404, message: "Invalid business id" };
    } else {
      throw {
        code: 500,
        message: "There was an issue with the server, try again later",
      };
    }
  }
}
