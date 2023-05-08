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

// src/modules/events/http/controllers/events/get-event-controller.ts
var get_event_controller_exports = {};
__export(get_event_controller_exports, {
  getEventController: () => getEventController
});
module.exports = __toCommonJS(get_event_controller_exports);
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

// src/modules/events/repositories/prisma/prisma-events-repository.ts
var PrismaEventsRepository = class {
  async findById(id) {
    const event = await prisma.event.findUnique({
      where: { id }
    });
    return event;
  }
  async findMany() {
    const events = await prisma.event.findMany({});
    return events;
  }
  async findByIdWithRelations(id) {
    const event = await prisma.event.findUnique({
      where: { id },
      include: { addresses: true }
    });
    return event;
  }
  async create(data) {
    const event = await prisma.event.create({
      data
    });
    return event;
  }
  async save(data) {
    const event = await prisma.event.update({
      where: { id: data.id },
      data
    });
    return event;
  }
};

// src/shared/errors/app-error.ts
var AppError = class {
  constructor(message, statusCode = 400) {
    this.message = message;
    this.statusCode = statusCode;
  }
};

// src/modules/events/use-cases/errors/resource-not-found-error.ts
var ResourceNotFoundError = class extends AppError {
  constructor() {
    super("Resource not found.", 404);
  }
};

// src/modules/events/use-cases/get-event-use-case.ts
var GetEventUseCase = class {
  constructor(eventsRepository) {
    this.eventsRepository = eventsRepository;
  }
  async execute({ id }) {
    const event = await this.eventsRepository.findById(id);
    if (!event)
      throw new ResourceNotFoundError();
    return { event };
  }
};

// src/modules/events/use-cases/factories/make-get-event-use-case.ts
function makeGetEventEventUseCase() {
  const eventsRepository = new PrismaEventsRepository();
  const useCase = new GetEventUseCase(eventsRepository);
  return useCase;
}

// src/modules/events/http/controllers/events/get-event-controller.ts
async function getEventController(request, reply) {
  const paramsSchema = import_zod2.z.object({
    id: import_zod2.z.string().uuid()
  }).strict();
  const { id } = paramsSchema.parse(request.params);
  const getEvent = makeGetEventEventUseCase();
  const { event } = await getEvent.execute({ id });
  return reply.status(200).send({ event });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getEventController
});
