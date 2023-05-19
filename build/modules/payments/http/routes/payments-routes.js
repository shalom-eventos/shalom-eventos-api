"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/modules/payments/http/routes/payments-routes.ts
var payments_routes_exports = {};
__export(payments_routes_exports, {
  paymentsRoutes: () => paymentsRoutes
});
module.exports = __toCommonJS(payments_routes_exports);

// src/shared/infra/http/middlewares/verify-user-role.ts
function verifyUserRole(roleToVerify) {
  return async (request, reply) => {
    const { role } = request.user;
    if (role !== roleToVerify) {
      return reply.status(401).send({ message: "Unauthorized." });
    }
  };
}

// src/shared/infra/http/middlewares/verify-jwt.ts
async function verifyJWT(request, reply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    return reply.status(401).send({ message: "Unauthorized." });
  }
}

// src/shared/lib/multer.ts
var import_fastify_multer2 = __toESM(require("fastify-multer"));

// src/config/upload.ts
var import_path = __toESM(require("path"));
var import_crypto = __toESM(require("crypto"));
var import_fastify_multer = __toESM(require("fastify-multer"));
var tmpFolder = import_path.default.resolve(__dirname, "..", "..", "tmp");
var upload_default = {
  driver: process.env.STORAGE_DRIVER,
  tmpFolder,
  uploadsFolder: import_path.default.resolve(tmpFolder, "uploads"),
  multer: {
    storage: import_fastify_multer.default.diskStorage({
      destination: tmpFolder,
      filename(request, file, callback) {
        const fileHash = import_crypto.default.randomBytes(10).toString("hex");
        const fileName = `${fileHash}-${file.originalname}`;
        return callback(null, fileName);
      }
    })
  },
  config: {
    disk: {},
    aws: {
      bucket: process.env.S3_BUCKET_NAME ?? "",
      region: process.env.S3_BUCKET_REGION ?? ""
    }
  }
};

// src/shared/lib/multer.ts
var multer2 = (0, import_fastify_multer2.default)(upload_default.multer);

// src/modules/payments/http/controllers/create-payment-controller.ts
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
    const ticket = await prisma.eventTicket.update({
      where: { id: data.id },
      data
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
      include: { payment: true }
    });
    return registrations;
  }
  async findManyByUser(user_id) {
    const registrations = await prisma.eventRegistration.findMany({
      where: { user_id },
      include: { event: { include: { addresses: true } }, payment: true }
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
    const registration = await prisma.eventRegistration.update({
      where: { id: data.id },
      data
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
    const payment = await prisma.payment.update({
      where: { id: data.id },
      data
    });
    return payment;
  }
};

// src/modules/payments/use-cases/create-payment-use-case.ts
var import_runtime = require("@prisma/client/runtime");

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
      price: new import_runtime.Decimal(price),
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

// src/modules/payments/http/controllers/update-payment-status-controller.ts
var import_zod3 = require("zod");

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

// src/modules/payments/http/controllers/update-payment-status-controller.ts
async function updatePaymentStatusController(request, reply) {
  const paramsSchema = import_zod3.z.object({
    id: import_zod3.z.string().uuid()
  }).strict();
  const { id } = paramsSchema.parse(request.params);
  const updatePayment = makeUpdatePaymentStatusUseCase();
  const { payment } = await updatePayment.execute({ payment_id: id });
  return reply.status(200).send({ payment });
}

// src/modules/payments/http/routes/payments-routes.ts
async function paymentsRoutes(app) {
  const participantMiddlewares = {
    onRequest: [verifyJWT, verifyUserRole("PARTICIPANT")],
    preHandler: multer2.single("file")
  };
  const adminMiddlewares = {
    onRequest: [verifyJWT, verifyUserRole("ADMINISTRATOR")]
  };
  app.post(
    "/payments/registration/:event_registration_id",
    participantMiddlewares,
    createPaymentController
  );
  app.patch(
    "/payments/:id/update-status",
    adminMiddlewares,
    updatePaymentStatusController
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  paymentsRoutes
});
