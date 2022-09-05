import { Business, findById } from "../repositories/businessRepository";

export async function getBusiness(businessId: number) {
  try {
    const business: Business = await findById(businessId);

    if (!business) {
      throw "err_invalid_businessId";
    } else {
      return business;
    }
  } catch (err: any) {
    throw err;
  }
}
