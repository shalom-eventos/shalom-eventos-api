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

// src/modules/event-tickets/http/routes/tickets-routes.ts
var tickets_routes_exports = {};
__export(tickets_routes_exports, {
  ticketsRoutes: () => ticketsRoutes
});
module.exports = __toCommonJS(tickets_routes_exports);

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

// src/modules/event-tickets/http/controllers/create-ticket-controller.ts
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

// src/shared/errors/app-error.ts
var AppError = class {
  constructor(message, statusCode = 400) {
    this.message = message;
    this.statusCode = statusCode;
  }
};

// src/modules/event-tickets/use-cases/errors/resource-not-found-error.ts
var ResourceNotFoundError = class extends AppError {
  constructor() {
    super("Resource not found.", 404);
  }
};

// src/modules/event-tickets/use-cases/errors/resource-not-found-or-expired-error.ts
var ResourceNotFoundOrExpiredError = class extends AppError {
  constructor() {
    super("Resource not found or Expired.", 404);
  }
};

// src/modules/event-tickets/use-cases/create-ticket-use-case.ts
var CreateTicketUseCase = class {
  constructor(ticketsRepository, eventsRepository) {
    this.ticketsRepository = ticketsRepository;
    this.eventsRepository = eventsRepository;
  }
  async execute({
    event_id,
    title,
    price,
    expires_in
  }) {
    const eventExists = await this.eventsRepository.findById(event_id);
    if (!eventExists)
      throw new ResourceNotFoundError();
    const ticket = await this.ticketsRepository.create({
      event_id,
      title,
      price,
      expires_in
    });
    if (!ticket)
      throw new ResourceNotFoundError();
    return { ticket };
  }
};

// src/modules/event-tickets/use-cases/factories/make-create-ticket-use-case.ts
function makeCreateTicketUseCase() {
  const ticketsRepository = new PrismaTicketsRepository();
  const useCase = new CreateTicketUseCase(ticketsRepository);
  return useCase;
}

// src/modules/event-tickets/http/controllers/create-ticket-controller.ts
async function createTicketController(request, reply) {
  const paramsSchema = import_zod2.z.object({
    event_id: import_zod2.z.string().uuid()
  }).strict();
  const bodySchema = import_zod2.z.object({
    title: import_zod2.z.string(),
    price: import_zod2.z.number().positive(),
    expires_in: import_zod2.z.coerce.date().optional()
  }).strict();
  const { event_id } = paramsSchema.parse(request.params);
  const { title, price, expires_in } = bodySchema.parse(request.body);
  const createTicket = makeCreateTicketUseCase();
  const { ticket } = await createTicket.execute({
    event_id,
    title,
    price,
    expires_in
  });
  return reply.status(200).send({ ticket });
}

// src/modules/event-tickets/http/controllers/list-tickets-by-event-controller.ts
var import_zod3 = require("zod");

// src/modules/event-tickets/use-cases/list-tickets-by-event-use-case.ts
var ListTicketsByEventUseCase = class {
  constructor(eventTicketsRepository) {
    this.eventTicketsRepository = eventTicketsRepository;
  }
  async execute({ event_id }) {
    const tickets = await this.eventTicketsRepository.findManyByEvent(event_id);
    return { tickets };
  }
};

// src/modules/event-tickets/use-cases/factories/make-list-tickets-by-event-use-case.ts
function makeListTicketsByEventUseCase() {
  const ticketsRepository = new PrismaTicketsRepository();
  const useCase = new ListTicketsByEventUseCase(ticketsRepository);
  return useCase;
}

// src/modules/event-tickets/http/controllers/list-tickets-by-event-controller.ts
async function listTicketsByEventController(request, reply) {
  const paramsSchema = import_zod3.z.object({
    event_id: import_zod3.z.string().uuid()
  }).strict();
  const { event_id } = paramsSchema.parse(request.params);
  const listTickets = makeListTicketsByEventUseCase();
  const { tickets } = await listTickets.execute({ event_id });
  return reply.status(200).send({ tickets });
}

// src/modules/event-tickets/http/controllers/update-ticket-controller.ts
var import_zod4 = require("zod");

// src/modules/event-tickets/use-cases/update-ticket-use-case.ts
var import_client2 = require("@prisma/client");
var UpdateEventTicketUseCase = class {
  constructor(ticketsRepository) {
    this.ticketsRepository = ticketsRepository;
  }
  async execute(id, { title, price, expires_in }) {
    const ticket = await this.ticketsRepository.findByIdIfEventNotExpired(id);
    if (!ticket)
      throw new ResourceNotFoundOrExpiredError();
    if (title)
      ticket.title = title;
    if (price)
      ticket.price = new import_client2.Prisma.Decimal(price);
    if (expires_in)
      ticket.expires_in = expires_in;
    await this.ticketsRepository.save(ticket);
    return { ticket };
  }
};

// src/modules/event-tickets/use-cases/factories/make-update-ticket-use-case.ts
function makeUpdateTicketUseCase() {
  const ticketsRepository = new PrismaTicketsRepository();
  const useCase = new UpdateEventTicketUseCase(ticketsRepository);
  return useCase;
}

// src/modules/event-tickets/http/controllers/update-ticket-controller.ts
async function updateTicketController(request, reply) {
  const paramsSchema = import_zod4.z.object({
    id: import_zod4.z.string().uuid()
  }).strict();
  const bodySchema = import_zod4.z.object({
    title: import_zod4.z.string().optional(),
    price: import_zod4.z.number().optional(),
    expires_in: import_zod4.z.coerce.date().optional()
  }).strict();
  const { id } = paramsSchema.parse(request.params);
  const { title, price, expires_in } = bodySchema.parse(request.body);
  const updateTicket = makeUpdateTicketUseCase();
  const { ticket } = await updateTicket.execute(id, {
    title,
    price,
    expires_in
  });
  return reply.status(200).send({ ticket });
}

// src/modules/event-tickets/http/routes/tickets-routes.ts
async function ticketsRoutes(app) {
  app.get("/tickets/event/:event_id", listTicketsByEventController);
  const middlewares = {
    onRequest: [verifyJWT, verifyUserRole("ADMINISTRATOR")]
  };
  app.post("/tickets/event/:event_id", middlewares, createTicketController);
  app.put("/tickets/:id", middlewares, updateTicketController);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ticketsRoutes
});
