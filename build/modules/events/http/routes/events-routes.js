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

// src/modules/events/http/routes/events-routes.ts
var events_routes_exports = {};
__export(events_routes_exports, {
  eventsRoutes: () => eventsRoutes
});
module.exports = __toCommonJS(events_routes_exports);

// src/modules/events/http/controllers/events/create-event-controller.ts
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
  async findBySlug(slug) {
    const event = await prisma.event.findUnique({
      where: { slug }
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
    const { id, created_at, updated_at, ...dataUpdated } = data;
    const event = await prisma.event.update({
      where: { id: data.id },
      data: dataUpdated
    });
    return event;
  }
};

// src/modules/events/use-cases/create-event-use-case.ts
var import_dayjs = __toESM(require("dayjs"));

// src/shared/errors/app-error.ts
var AppError = class {
  constructor(message, statusCode = 400) {
    this.message = message;
    this.statusCode = statusCode;
  }
};

// src/modules/events/use-cases/errors/invalid-date-interval-error.ts
var InvalidDateIntervalError = class extends AppError {
  constructor() {
    super("Invalid date interval.", 403);
  }
};

// src/shared/utils/generate-slug.ts
var generateSlug = ({
  keyword,
  separator = "-",
  withHash = false,
  hash
}) => {
  const slug = `${keyword.toLowerCase()}`.replace(
    /([^a-z0-9 ]+)|\s/gi,
    separator
  );
  if (!withHash)
    return slug;
  const hashCode = hash ?? String((/* @__PURE__ */ new Date()).getTime()).substring(8);
  return slug + separator + hashCode;
};

// src/modules/events/use-cases/create-event-use-case.ts
var CreateEventUseCase = class {
  constructor(eventsRepository) {
    this.eventsRepository = eventsRepository;
  }
  async execute({
    title,
    description,
    start_date,
    end_date
  }) {
    const endDate = end_date ? end_date : (0, import_dayjs.default)(start_date).endOf("date").toDate();
    if ((0, import_dayjs.default)(start_date).isAfter(end_date))
      throw new InvalidDateIntervalError();
    let slug = generateSlug({ keyword: title });
    for (let i = 1; i < 1e3; i++) {
      const slugExists = await this.eventsRepository.findBySlug(slug);
      if (slugExists) {
        slug = generateSlug({
          keyword: title,
          withHash: true,
          hash: String(i)
        });
      } else {
        break;
      }
    }
    const event = await this.eventsRepository.create({
      slug,
      title,
      description,
      start_date,
      end_date: endDate
    });
    return { event };
  }
};

// src/modules/events/use-cases/factories/make-create-event-use-case.ts
function makeCreateEventUseCase() {
  const eventsRepository = new PrismaEventsRepository();
  const useCase = new CreateEventUseCase(eventsRepository);
  return useCase;
}

// src/modules/events/http/controllers/events/create-event-controller.ts
async function createEventController(request, reply) {
  const bodySchema = import_zod2.z.object({
    title: import_zod2.z.string(),
    description: import_zod2.z.string().optional(),
    start_date: import_zod2.z.coerce.date(),
    end_date: import_zod2.z.coerce.date().optional()
  }).strict();
  const { title, description, start_date, end_date } = bodySchema.parse(
    request.body
  );
  const createEvent = makeCreateEventUseCase();
  const { event } = await createEvent.execute({
    title,
    description,
    start_date,
    end_date
  });
  return reply.status(200).send({ event });
}

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

// src/modules/events/http/controllers/events/get-event-controller.ts
var import_zod3 = require("zod");

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
  const paramsSchema = import_zod3.z.object({
    id: import_zod3.z.string().uuid()
  }).strict();
  const { id } = paramsSchema.parse(request.params);
  const getEvent = makeGetEventEventUseCase();
  const { event } = await getEvent.execute({ id });
  return reply.status(200).send({ event });
}

// src/modules/events/http/controllers/events/update-event-controller.ts
var import_zod4 = require("zod");

// src/modules/events/use-cases/update-event-use-case.ts
var import_dayjs2 = __toESM(require("dayjs"));

// src/modules/events/use-cases/errors/slug-exists-error.ts
var SlugExistsError = class extends AppError {
  constructor() {
    super("Slug already exists.", 409);
  }
};

// src/modules/events/use-cases/update-event-use-case.ts
var UpdateEventUseCase = class {
  constructor(eventsRepository) {
    this.eventsRepository = eventsRepository;
  }
  async execute(id, { slug, title, description, start_date, end_date }) {
    const event = await this.eventsRepository.findById(id);
    if (!event)
      throw new ResourceNotFoundError();
    if (title)
      event.title = title;
    if (description)
      event.description = description;
    if (start_date && end_date) {
      if ((0, import_dayjs2.default)(start_date).isAfter(end_date))
        throw new InvalidDateIntervalError();
    }
    if (start_date) {
      if ((0, import_dayjs2.default)(start_date).isAfter(event.end_date))
        throw new InvalidDateIntervalError();
      event.start_date = start_date;
    }
    if (end_date) {
      if ((0, import_dayjs2.default)(end_date).isBefore(event.start_date))
        throw new InvalidDateIntervalError();
      event.end_date = end_date;
    }
    if (slug) {
      const slugHashed = generateSlug({ keyword: slug });
      const slugExists = await this.eventsRepository.findBySlug(slugHashed);
      if (slugExists && slugHashed !== event.slug)
        throw new SlugExistsError();
      event.slug = slugHashed;
    }
    await this.eventsRepository.save(event);
    return { event };
  }
};

// src/modules/events/use-cases/factories/make-update-event-use-case.ts
function makeUpdateEventUseCase() {
  const eventsRepository = new PrismaEventsRepository();
  const useCase = new UpdateEventUseCase(eventsRepository);
  return useCase;
}

// src/modules/events/http/controllers/events/update-event-controller.ts
async function updateEventController(request, reply) {
  const paramsSchema = import_zod4.z.object({
    id: import_zod4.z.string().uuid()
  }).strict();
  const bodySchema = import_zod4.z.object({
    slug: import_zod4.z.string().optional(),
    title: import_zod4.z.string().optional(),
    description: import_zod4.z.string().optional(),
    start_date: import_zod4.z.coerce.date().optional(),
    end_date: import_zod4.z.coerce.date().optional()
  }).strict();
  const { id } = paramsSchema.parse(request.params);
  const { title, description, start_date, end_date } = bodySchema.parse(
    request.body
  );
  const updateEvent = makeUpdateEventUseCase();
  const { event } = await updateEvent.execute(id, {
    title,
    description,
    start_date,
    end_date
  });
  return reply.status(200).send({ event });
}

// src/modules/events/use-cases/list-evente-use-case.ts
var ListEventsUseCase = class {
  constructor(eventsRepository) {
    this.eventsRepository = eventsRepository;
  }
  async execute() {
    const events = await this.eventsRepository.findMany();
    return { events };
  }
};

// src/modules/events/use-cases/factories/make-list-events-use-case.ts
function makeListEventsUseCase() {
  const eventsRepository = new PrismaEventsRepository();
  const useCase = new ListEventsUseCase(eventsRepository);
  return useCase;
}

// src/modules/events/http/controllers/events/list-events-controller.ts
async function listEventsController(request, reply) {
  const listEvents = makeListEventsUseCase();
  const { events } = await listEvents.execute();
  return reply.status(200).send({ events });
}

// src/modules/events/http/routes/events-routes.ts
async function eventsRoutes(app) {
  app.get("/events/:id", getEventController);
  app.get("/events", listEventsController);
  const middlewares = {
    onRequest: [verifyJWT, verifyUserRole("ADMINISTRATOR")]
  };
  app.post("/events", middlewares, createEventController);
  app.put("/events/:id", middlewares, updateEventController);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  eventsRoutes
});
