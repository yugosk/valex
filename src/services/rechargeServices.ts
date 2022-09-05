import * as rechargeRepository from "../repositories/rechargeRepository";

export async function recharge(
  rechargeData: rechargeRepository.RechargeInsertData
) {
  try {
    await rechargeRepository.insert(rechargeData);
  } catch (err) {
    throw err;
  }
}
