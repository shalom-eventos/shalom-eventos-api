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

// src/modules/payments/http/controllers/create-payment-controller.ts
var create_payment_controller_exports = {};
__export(create_payment_controller_exports, {
  createPaymentController: () => createPaymentController
});
module.exports = __toCommonJS(create_payment_controller_exports);
var import_zod2 = require("zod");

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

// src/modules/event-tickets/repositories/prisma/prisma-addresses-repository.ts
var PrismaTicketsRepository = class {
  async findById(id) {
    const ticket = await prisma.eventTicket.findUnique({
      where: { id }
    });
    return ticket;
  }
  async findByIdIfEventNotExpired(id) {
    const ticket = await prisma.eventTicket.findFirst({
      where: {
        id,
        event: {
          end_date: {
            gt: /* @__PURE__ */ new Date()
          }
        }
      }
    });
    return ticket;
  }
  async findFirstNotExpiredByEvent(event_id) {
    const ticket = await prisma.eventTicket.findFirst({
      where: {
        event_id,
        expires_in: { gt: /* @__PURE__ */ new Date() }
      }
    });
    return ticket;
  }
  async findManyByEvent(event_id) {
    const ticket = await prisma.eventTicket.findMany({
      where: { event_id }
    });
    return ticket;
  }
  async create(data) {
    const ticket = await prisma.eventTicket.create({
      data
    });
    return ticket;
  }
  async save(data) {
    const { id, created_at, updated_at, ...dataUpdated } = data;
    const ticket = await prisma.eventTicket.update({
      where: { id: data.id },
      data: dataUpdated
    });
    return ticket;
  }
};

// src/modules/event-registrations/repositories/prisma/prisma-registrations-repository.ts
var PrismaRegistrationsRepository = class {
  async findById(id) {
    const registration = await prisma.eventRegistration.findUnique({
      where: { id }
    });
    return registration;
  }
  async findByEventAndUser(event_id, user_id) {
    const registration = await prisma.eventRegistration.findFirst({
      where: { event_id, user_id }
    });
    return registration;
  }
  async findByIdAndUser(id, user_id) {
    const registration = await prisma.eventRegistration.findFirst({
      where: { id, user_id }
    });
    return registration;
  }
  async findManyByEvent(event_id) {
    const registrations = await prisma.eventRegistration.findMany({
      where: { event_id },
      include: {
        user: { select: { email: true, participant: true, addresses: true } },
        payment: true,
        event: { include: { addresses: true } }
      }
    });
    return registrations;
  }
  async findManyByUser(user_id) {
    const registrations = await prisma.eventRegistration.findMany({
      where: { user_id },
      include: {
        user: {
          select: { email: true, participant: true }
        },
        event: { include: { addresses: true } },
        payment: true
      }
    });
    return registrations;
  }
  async create(data) {
    const registration = await prisma.eventRegistration.create({
      data
    });
    return registration;
  }
  async save(data) {
    const { id, created_at, updated_at, ...dataUpdated } = data;
    const registration = await prisma.eventRegistration.update({
      where: { id: data.id },
      data: dataUpdated
    });
    return registration;
  }
};

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

// src/modules/payments/use-cases/create-payment-use-case.ts
var import_client2 = require("@prisma/client");

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

// src/modules/payments/use-cases/errors/ticket-not-found-error.ts
var TicketNotFoundError = class extends AppError {
  constructor() {
    super("No valid ticket found.", 404);
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
    payment_method,
    price,
    file
  }) {
    const registration = await this.registrationsRepository.findByIdAndUser(
      event_registration_id,
      user_id
    );
    if (!registration)
      throw new RegistrationNotFoundError();
    const ticket = await this.ticketsRepository.findFirstNotExpiredByEvent(
      registration.event_id
    );
    if (!ticket)
      throw new TicketNotFoundError();
    const payment = await this.paymentsRepository.create({
      event_registration_id,
      event_ticket_id: ticket.id,
      payment_method,
      price: new import_client2.Prisma.Decimal(price),
      file,
      status: "sent"
    });
    return { payment };
  }
};

// src/modules/payments/use-cases/factories/make-create-payment-use-case.ts
function makeCreatePaymentUseCase() {
  const paymentsRepository = new PrismaPaymentsRepository();
  const registrationsRepository = new PrismaRegistrationsRepository();
  const ticketsRepository = new PrismaTicketsRepository();
  const useCase = new CreatePaymentUseCase(
    paymentsRepository,
    registrationsRepository,
    ticketsRepository
  );
  return useCase;
}

// src/modules/payments/http/controllers/create-payment-controller.ts
async function createPaymentController(request, reply) {
  const paramsSchema = import_zod2.z.object({
    event_registration_id: import_zod2.z.string().uuid()
  }).strict();
  const bodySchema = import_zod2.z.object({
    payment_method: import_zod2.z.enum([
      "PIX",
      "DINHEIRO",
      "CART\xC3O DE D\xC9BITO",
      "CART\xC3O DE CR\xC9DITO"
    ]),
    price: import_zod2.z.coerce.number().positive()
  }).strict();
  const user_id = request.user.sub;
  const file = request.file;
  const { event_registration_id } = paramsSchema.parse(request.params);
  const { payment_method, price } = bodySchema.parse(request.body);
  const createPayment = makeCreatePaymentUseCase();
  const { payment } = await createPayment.execute({
    user_id,
    event_registration_id,
    payment_method,
    price,
    file: String(file.filename)
  });
  return reply.status(200).send({ payment });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createPaymentController
});
