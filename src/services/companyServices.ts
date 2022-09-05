import { Company, findByApiKey } from "../repositories/companyRepository";

export async function getCompany(apiKey: string) {
  try {
    const company: Company = await findByApiKey(apiKey);

    if (!company) {
      throw "err_apiKey";
    } else {
      return company;
    }
  } catch (err: any) {
    throw err;
  }
}
