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

// src/modules/event-registrations/http/routes/registrations-routes.ts
var registrations_routes_exports = {};
__export(registrations_routes_exports, {
  registrationsRoutes: () => registrationsRoutes
});
module.exports = __toCommonJS(registrations_routes_exports);

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

// src/modules/event-registrations/http/controllers/create-registration-controller.ts
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

// src/shared/errors/app-error.ts
var AppError = class {
  constructor(message, statusCode = 400) {
    this.message = message;
    this.statusCode = statusCode;
  }
};

// src/modules/event-registrations/use-cases/errors/event-not-found-error.ts
var EventNotFoundError = class extends AppError {
  constructor() {
    super("Event not found.", 404);
  }
};

// src/modules/event-registrations/use-cases/errors/user-not-found-error.ts
var UserNotFoundError = class extends AppError {
  constructor() {
    super("User not found.", 404);
  }
};

// src/modules/event-registrations/use-cases/errors/user-already-registered-error.ts
var UserAlreadyRegisteredError = class extends AppError {
  constructor() {
    super("User is already registered for this event", 409);
  }
};

// src/modules/event-registrations/use-cases/create-registration-use-case.ts
var CreateEventRegistrationUseCase = class {
  constructor(registrationsRepository, eventsRepository, usersRepository) {
    this.registrationsRepository = registrationsRepository;
    this.eventsRepository = eventsRepository;
    this.usersRepository = usersRepository;
  }
  async execute({
    user_id,
    event_id,
    full_name,
    phone_number,
    age,
    document_number,
    document_type,
    guardian_name,
    guardian_phone_number,
    prayer_group,
    event_source,
    community_type,
    pcd_description,
    allergy_description,
    transportation_mode,
    accepted_the_terms
  }) {
    const eventExists = await this.eventsRepository.findById(event_id);
    if (!eventExists)
      throw new EventNotFoundError();
    const userExists = await this.usersRepository.findById(user_id);
    if (!userExists)
      throw new UserNotFoundError();
    const registrationExtist = await this.registrationsRepository.findByEventAndUser(event_id, user_id);
    if (registrationExtist)
      throw new UserAlreadyRegisteredError();
    const registration = await this.registrationsRepository.create({
      user_id,
      event_id,
      full_name,
      phone_number,
      age,
      document_number,
      document_type,
      guardian_name,
      guardian_phone_number,
      prayer_group,
      event_source,
      community_type,
      pcd_description,
      allergy_description,
      transportation_mode,
      accepted_the_terms
    });
    return { registration };
  }
};

// src/modules/users/repositories/prisma/prisma-users-repository.ts
var PrismaUsersRepository = class {
  async findById(id) {
    const user = await prisma.user.findUnique({
      where: { id }
    });
    return user;
  }
  async findByEmail(email) {
    const user = await prisma.user.findUnique({
      where: { email }
    });
    return user;
  }
  async create(data) {
    const user = await prisma.user.create({
      data
    });
    return user;
  }
};

// src/modules/event-registrations/use-cases/factories/make-create-registration-use-case.ts
function makeCreateEventRegistrationUseCase() {
  const registrationsRepository = new PrismaRegistrationsRepository();
  const eventsRepository = new PrismaEventsRepository();
  const usersRepository = new PrismaUsersRepository();
  const useCase = new CreateEventRegistrationUseCase(
    registrationsRepository,
    eventsRepository,
    usersRepository
  );
  return useCase;
}

// src/modules/event-registrations/http/controllers/create-registration-controller.ts
async function createRegistrationController(request, reply) {
  const paramsSchema = import_zod2.z.object({
    event_id: import_zod2.z.string().uuid()
  }).strict();
  const bodySchema = import_zod2.z.object({
    full_name: import_zod2.z.string().min(5),
    phone_number: import_zod2.z.string(),
    age: import_zod2.z.number().int().positive(),
    document_number: import_zod2.z.string(),
    document_type: import_zod2.z.enum(["CPF", "RG"]),
    guardian_name: import_zod2.z.string().optional(),
    guardian_phone_number: import_zod2.z.string().optional(),
    prayer_group: import_zod2.z.string().optional(),
    event_source: import_zod2.z.string().optional(),
    community_type: import_zod2.z.enum(["VIDA", "ALIAN\xC7A"]).optional(),
    pcd_description: import_zod2.z.string().optional(),
    allergy_description: import_zod2.z.string().optional(),
    transportation_mode: import_zod2.z.enum(["TRANSPORTE PR\xD3PRIO", "\xD4NIBUS"]),
    accepted_the_terms: import_zod2.z.boolean().refine((value) => value === true, {
      message: "User must accept the terms",
      path: ["accepted_the_terms"]
    })
  }).strict();
  const user_id = request.user.sub;
  const { event_id } = paramsSchema.parse(request.params);
  const {
    full_name,
    phone_number,
    age,
    document_number,
    document_type,
    guardian_name,
    guardian_phone_number,
    prayer_group,
    event_source,
    community_type,
    pcd_description,
    allergy_description,
    transportation_mode,
    accepted_the_terms
  } = bodySchema.parse(request.body);
  const createEventRegistration = makeCreateEventRegistrationUseCase();
  const { registration } = await createEventRegistration.execute({
    user_id,
    event_id,
    full_name,
    phone_number,
    age,
    document_number,
    document_type,
    guardian_name,
    guardian_phone_number,
    prayer_group,
    event_source,
    community_type,
    pcd_description,
    allergy_description,
    transportation_mode,
    accepted_the_terms
  });
  return reply.status(200).send({ registration });
}

// src/modules/event-registrations/http/controllers/list-registrations-by-event-controller.ts
var import_zod3 = require("zod");

// src/modules/event-registrations/use-cases/list-registrations-by-event-use-case.ts
var ListRegistrationsByEventUseCase = class {
  constructor(registrationsRepository) {
    this.registrationsRepository = registrationsRepository;
  }
  async execute({ event_id }) {
    const registrations = await this.registrationsRepository.findManyByEvent(
      event_id
    );
    return { registrations };
  }
};

// src/modules/event-registrations/use-cases/factories/make-list-registrations-by-event-use-case.ts
function makeListRegistrationsByEventUseCase() {
  const eventRegistrationsRepository = new PrismaRegistrationsRepository();
  const useCase = new ListRegistrationsByEventUseCase(
    eventRegistrationsRepository
  );
  return useCase;
}

// src/modules/event-registrations/http/controllers/list-registrations-by-event-controller.ts
async function listRegistrationsByEventController(request, reply) {
  const paramsSchema = import_zod3.z.object({
    event_id: import_zod3.z.string().uuid()
  }).strict();
  const { event_id } = paramsSchema.parse(request.params);
  const listRegistrationsByEvent = makeListRegistrationsByEventUseCase();
  const { registrations } = await listRegistrationsByEvent.execute({
    event_id
  });
  return reply.status(200).send({ registrations });
}

// src/modules/event-registrations/use-cases/list-registrations-by-user-use-case.ts
var ListRegistrationsByUserUseCase = class {
  constructor(registrationsRepository) {
    this.registrationsRepository = registrationsRepository;
  }
  async execute({ user_id }) {
    const registrations = await this.registrationsRepository.findManyByUser(
      user_id
    );
    return { registrations };
  }
};

// src/modules/event-registrations/use-cases/factories/make-list-registrations-by-user-use-case.ts
function makeListRegistrationsByUserUseCase() {
  const registrationsRepository = new PrismaRegistrationsRepository();
  const useCase = new ListRegistrationsByUserUseCase(registrationsRepository);
  return useCase;
}

// src/modules/event-registrations/http/controllers/list-registrations-by-user-controller.ts
async function listRegistrationsByUserController(request, reply) {
  const user_id = request.user.sub;
  const listRegistrationsByUser = makeListRegistrationsByUserUseCase();
  const { registrations } = await listRegistrationsByUser.execute({
    user_id
  });
  return reply.status(200).send({ registrations });
}

// src/modules/event-registrations/http/controllers/validate-registration-controller.ts
var import_zod4 = require("zod");

// src/modules/event-registrations/use-cases/validate-registration-use-case.ts
var ValidateRegistrationUseCase = class {
  constructor(registrationsRepository) {
    this.registrationsRepository = registrationsRepository;
  }
  async execute({ registration_id }) {
    const registration = await this.registrationsRepository.findById(
      registration_id
    );
    if (!registration)
      throw new EventNotFoundError();
    if (registration.is_approved)
      return { registration };
    registration.is_approved = !registration.is_approved;
    await this.registrationsRepository.save(registration);
    return { registration };
  }
};

// src/modules/event-registrations/use-cases/factories/make-validate-registration-use-case.ts
function makeValidateRegistrationUseCase() {
  const eventRegistrationsRepository = new PrismaRegistrationsRepository();
  const useCase = new ValidateRegistrationUseCase(eventRegistrationsRepository);
  return useCase;
}

// src/modules/event-registrations/http/controllers/validate-registration-controller.ts
async function validateRegistrationController(request, reply) {
  const paramsSchema = import_zod4.z.object({
    registration_id: import_zod4.z.string().uuid()
  }).strict();
  const { registration_id } = paramsSchema.parse(request.params);
  const validateRegistration = makeValidateRegistrationUseCase();
  const { registration } = await validateRegistration.execute({
    registration_id
  });
  return reply.status(200).send({ registration });
}

// src/modules/event-registrations/http/routes/registrations-routes.ts
async function registrationsRoutes(app) {
  const adminMiddlewares = {
    onRequest: [verifyJWT, verifyUserRole("ADMINISTRATOR")]
  };
  const participantMiddlewares = {
    onRequest: [verifyJWT, verifyUserRole("PARTICIPANT")]
  };
  app.get(
    "/registrations/event/:event_id",
    adminMiddlewares,
    listRegistrationsByEventController
  );
  app.patch(
    "/registrations/:registration_id/validate",
    adminMiddlewares,
    validateRegistrationController
  );
  app.post(
    "/registrations/event/:event_id",
    participantMiddlewares,
    createRegistrationController
  );
  app.get(
    "/registrations/my",
    participantMiddlewares,
    listRegistrationsByUserController
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  registrationsRoutes
});