interface Error {
  code: number;
  message: string;
}

export function errorDetails(err: any): Error {
  switch (err) {
    case "err_employee_not_found":
      return {
        code: 404,
        message: "This employee ID does not exist",
      };

    case "err_employee_card":
      return {
        code: 409,
        message: "This employee already has a card of this type",
      };

    case "err_card_info":
      return {
        code: 404,
        message: "Invalid card info",
      };

    case "err_security_code":
      return {
        code: 401,
        message: "Invalid security code",
      };

    case "err_activated":
      return {
        code: 409,
        message: "Card already activated",
      };

    case "err_card_type":
      return {
        code: 401,
        message: "This card type does not match the businesses",
      };

    case "err_insufficient_funds":
      return {
        code: 402,
        message:
          "This card does not contain the necessary amount to complete the purchase",
      };

    case "err_invalid_businessId":
      return {
        code: 404,
        message: "This business ID does not exist",
      };

    case "err_card_id":
      return {
        code: 404,
        message: "Invalid card ID",
      };

    case "err_blocked":
      return { code: 409, message: "Card is blocked" };

    case "err_unblocked":
      return {
        code: 409,
        message: "Card is already unblocked",
      };

    case "err_expired":
      return {
        code: 410,
        message: "Card expired",
      };

    case "err_password":
      return {
        code: 401,
        message: "Incorrect password",
      };

    case "err_unactivated":
      return {
        code: 409,
        message: "This card has not been activated yet",
      };

    case "err_apiKey":
      return {
        code: 401,
        message: "Invalid API key",
      };

    default:
      return {
        code: 500,
        message: "Server error",
      };
  }
}
