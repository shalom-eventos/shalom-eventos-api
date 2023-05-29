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

// src/modules/payments/use-cases/factories/make-update-ticket-use-case.ts
var make_update_ticket_use_case_exports = {};
__export(make_update_ticket_use_case_exports, {
  makeUpdatePaymentStatusUseCase: () => makeUpdatePaymentStatusUseCase
});
module.exports = __toCommonJS(make_update_ticket_use_case_exports);

// src/shared/env/index.ts
var import_config = require("dotenv/config");
var import_zod = require("zod");
var envSchema = import_zod.z.object({
  NODE_ENV: import_zod.z.enum(["dev", "test", "production"]).default("dev"),
  JWT_SECRET: import_zod.z.string(),
  PORT: import_zod.z.coerce.number().default(3333)
});
var _env = envSchema.safeParse(process.env);
if (_env.success === false) {
  console.error("\u274C Invalid environments variables", _env.error.format());
  throw new Error("Invalid environment variables");
}
var env = _env.data;

// src/shared/lib/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient({
  log: env.NODE_ENV === "dev" ? ["query"] : []
});

// src/modules/payments/repositories/prisma/prisma-payments-repository.ts
var PrismaPaymentsRepository = class {
  async findById(id) {
    const payment = await prisma.payment.findUnique({
      where: { id }
    });
    return payment;
  }
  async create(data) {
    const payment = await prisma.payment.create({
      data
    });
    return payment;
  }
  async save(data) {
    const { id, created_at, updated_at, ...dataUpdated } = data;
    const payment = await prisma.payment.update({
      where: { id: data.id },
      data: dataUpdated
    });
    return payment;
  }
};

// src/shared/errors/app-error.ts
var AppError = class {
  constructor(message, statusCode = 400) {
    this.message = message;
    this.statusCode = statusCode;
  }
};

// src/modules/payments/use-cases/errors/registration-not-found-error.ts
var RegistrationNotFoundError = class extends AppError {
  constructor() {
    super("Registration not found.", 404);
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
      throw new RegistrationNotFoundError();
    if (payment.status === "approved") {
      payment.status = "refused";
    } else {
      payment.status = "approved";
    }
    await this.paymentsRepository.save(payment);
    return { payment };
  }
};

// src/modules/payments/use-cases/factories/make-update-ticket-use-case.ts
function makeUpdatePaymentStatusUseCase() {
  const paymentsRepository = new PrismaPaymentsRepository();
  const useCase = new UpdatePaymentStatusUseCase(paymentsRepository);
  return useCase;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  makeUpdatePaymentStatusUseCase
});
