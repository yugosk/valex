import { Company, findByApiKey } from "../repositories/companyRepository";

export async function getCompany(apiKey: string) {
  try {
    const company: Company = await findByApiKey(apiKey);

    if (!company) {
      throw "err_invalid_apiKey";
    } else {
      return company;
    }
  } catch (err) {
    if (err === "err_invalid_apiKey") {
      throw { code: 404, message: "Invalid api key" };
    } else {
      throw {
        code: 500,
        message: "There was an issue with the server, try again later",
      };
    }
  }
}
