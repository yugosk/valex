import * as paymentRepository from "../repositories/paymentRepository";

export async function payment(
  paymentInfo: paymentRepository.PaymentInsertData
) {
  try {
    await paymentRepository.insert(paymentInfo);
  } catch (err) {
    throw err;
  }
}
