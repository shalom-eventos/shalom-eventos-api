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

// src/modules/payments/use-cases/create-payment-use-case.ts
var create_payment_use_case_exports = {};
__export(create_payment_use_case_exports, {
  CreatePaymentUseCase: () => CreatePaymentUseCase
});
module.exports = __toCommonJS(create_payment_use_case_exports);
var import_runtime = require("@prisma/client/runtime");

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

// src/modules/payments/use-cases/create-payment-use-case.ts
var CreatePaymentUseCase = class {
  constructor(paymentsRepository, registrationsRepository, ticketsRepository) {
    this.paymentsRepository = paymentsRepository;
    this.registrationsRepository = registrationsRepository;
    this.ticketsRepository = ticketsRepository;
  }
  async execute({
    user_id,
    event_registration_id,
    event_ticket_id,
    payment_method,
    price,
    file
  }) {
    const registration = await this.registrationsRepository.findByIdAndUser(
      event_registration_id,
      user_id
    );
    if (!registration)
      throw new ResourceNotFoundError();
    const ticket = await this.ticketsRepository.findById(event_ticket_id);
    if (!ticket)
      throw new ResourceNotFoundError();
    const payment = await this.paymentsRepository.create({
      event_registration_id,
      event_ticket_id,
      payment_method,
      price: new import_runtime.Decimal(price),
      file,
      status: "sent"
    });
    return { payment };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CreatePaymentUseCase
});