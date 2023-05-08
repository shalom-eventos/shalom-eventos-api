"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/modules/payments/use-cases/update-payment-status-use-case.ts
var update_payment_status_use_case_exports = {};
__export(update_payment_status_use_case_exports, {
  UpdatePaymentStatusUseCase: () => UpdatePaymentStatusUseCase
});
module.exports = __toCommonJS(update_payment_status_use_case_exports);

// src/shared/errors/app-error.ts
var AppError = class {
  constructor(message, statusCode = 400) {
    this.message = message;
    this.statusCode = statusCode;
  }
};

// src/modules/payments/use-cases/errors/resource-not-found-error.ts
var ResourceNotFoundError = class extends AppError {
  constructor() {
    super("Resource not found.", 404);
  }
};

// src/modules/payments/use-cases/update-payment-status-use-case.ts
var UpdatePaymentStatusUseCase = class {
  constructor(paymentsRepository) {
    this.paymentsRepository = paymentsRepository;
  }
  async execute({ payment_id }) {
    const payment = await this.paymentsRepository.findById(payment_id);
    if (!payment)
      throw new ResourceNotFoundError();
    if (payment.status === "approved") {
      payment.status = "refused";
    } else {
      payment.status = "approved";
    }
    await this.paymentsRepository.save(payment);
    return { payment };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  UpdatePaymentStatusUseCase
});
