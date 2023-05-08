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

// src/shared/infra/http/routes.ts
var routes_exports = {};
__export(routes_exports, {
  appRoutes: () => appRoutes
});
module.exports = __toCommonJS(routes_exports);

// src/modules/users/http/controllers/authenticate.ts
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

// src/modules/users/use-cases/authenticate.ts
var import_bcryptjs = require("bcryptjs");

// src/shared/errors/app-error.ts
var AppError = class {
  constructor(message, statusCode = 400) {
    this.message = message;
    this.statusCode = statusCode;
  }
};

// src/modules/users/use-cases/errors/invalid-credentials-error.ts
var InvalidCredentialsError = class extends AppError {
  constructor() {
    super("Invalid credentials.", 401);
  }
};

// src/modules/users/use-cases/authenticate.ts
var AuthenticateUseCase = class {
  constructor(usersRepository) {
    this.usersRepository = usersRepository;
  }
  async execute({
    email,
    password
  }) {
    const user = await this.usersRepository.findByEmail(email);
    if (!user)
      throw new InvalidCredentialsError();
    const doesPasswordMatches = await (0, import_bcryptjs.compare)(password, user.password_hash);
    if (!doesPasswordMatches)
      throw new InvalidCredentialsError();
    return { user };
  }
};

// src/modules/users/use-cases/factories/make-authenticate-use-case.ts
function makeAuthenticateUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const authenticateUseCase = new AuthenticateUseCase(usersRepository);
  return authenticateUseCase;
}

// src/shared/utils/exclude-fields.ts
function excludeFields(model, keys) {
  for (let key of keys) {
    delete model[key];
  }
  return model;
}

// src/modules/users/http/controllers/authenticate.ts
async function authenticate(request, reply) {
  const authenticateBodySchema = import_zod2.z.object({
    email: import_zod2.z.string().email(),
    password: import_zod2.z.string().min(6)
  });
  const { email, password } = authenticateBodySchema.parse(request.body);
  const authenticateUseCase = makeAuthenticateUseCase();
  const { user } = await authenticateUseCase.execute({
    email,
    password
  });
  const token = await reply.jwtSign(
    { role: user.role },
    { sign: { sub: user.id } }
  );
  const refreshToken = await reply.jwtSign(
    {
      role: user.role
    },
    { sign: { sub: user.id, expiresIn: "7d" } }
  );
  return reply.setCookie("refreshToken", refreshToken, {
    path: "/",
    secure: true,
    sameSite: true,
    httpOnly: true
  }).status(200).send({
    user: excludeFields(user, ["password_hash"]),
    token
  });
}

// src/modules/users/http/routes/sessions-routes.ts
async function sessionsRoutes(app) {
  app.post("/sessions", authenticate);
}

// src/modules/users/http/controllers/register.ts
var import_zod3 = require("zod");

// src/modules/users/use-cases/errors/user-already-exists-error.ts
var UserAlreadyExistsError = class extends AppError {
  constructor() {
    super("E-mail already exists.", 409);
  }
};

// src/modules/users/use-cases/register.ts
var import_bcryptjs2 = require("bcryptjs");
var RegisterUseCase = class {
  constructor(usersRepository) {
    this.usersRepository = usersRepository;
  }
  async execute({
    name,
    email,
    password
  }) {
    const password_hash = await (0, import_bcryptjs2.hash)(password, 6);
    const userWithSameEmail = await this.usersRepository.findByEmail(email);
    if (userWithSameEmail) {
      throw new UserAlreadyExistsError();
    }
    const user = await this.usersRepository.create({
      name,
      email,
      password_hash
    });
    return { user };
  }
};

// src/modules/users/use-cases/factories/make-register-use-case.ts
function makeRegisterUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const registerUseCase = new RegisterUseCase(usersRepository);
  return registerUseCase;
}

// src/modules/users/http/controllers/register.ts
async function register(request, reply) {
  const registerBodySchema = import_zod3.z.object({
    name: import_zod3.z.string(),
    email: import_zod3.z.string().email(),
    password: import_zod3.z.string().min(6),
    password_confirmation: import_zod3.z.string().min(6)
  }).strict().refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ["password_confirmation"]
  });
  const { name, email, password } = registerBodySchema.parse(request.body);
  try {
    const registerUseCase = makeRegisterUseCase();
    await registerUseCase.execute({
      name,
      email,
      password
    });
  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      reply.status(409).send({ message: err.message });
    }
    throw err;
  }
  return reply.status(201).send();
}

// src/modules/users/http/routes/users-routes.ts
async function userRoutes(app) {
  app.post("/users", register);
}

// src/shared/infra/http/middlewares/verify-jwt.ts
async function verifyJWT(request, reply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    return reply.status(401).send({ message: "Unauthorized." });
  }
}

// src/modules/users/use-cases/errors/resource-not-found-error.ts
var ResourceNotFoundError = class extends AppError {
  constructor() {
    super("Resource not found.", 404);
  }
};

// src/modules/users/use-cases/get-user-profile.ts
var GetUserProfileUseCase = class {
  constructor(usersRepository) {
    this.usersRepository = usersRepository;
  }
  async execute({
    userId
  }) {
    const user = await this.usersRepository.findById(userId);
    if (!user)
      throw new ResourceNotFoundError();
    return { user };
  }
};

// src/modules/users/use-cases/factories/make-get-user-profile-use-case.ts
function makeGetUserProfileUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const useCase = new GetUserProfileUseCase(usersRepository);
  return useCase;
}

// src/modules/users/http/controllers/profile.ts
async function profile(request, reply) {
  const userId = request?.user?.sub;
  const getUserProfile = makeGetUserProfileUseCase();
  const { user } = await getUserProfile.execute({ userId });
  return reply.status(200).send({ user: excludeFields(user, ["password_hash"]) });
}

// src/modules/users/http/routes/profile-routes.ts
async function profileRoutes(app) {
  app.get("/profile", { onRequest: [verifyJWT] }, profile);
}

// src/modules/events/http/controllers/events/create-event-controller.ts
var import_zod4 = require("zod");

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

// src/modules/events/use-cases/create-event-use-case.ts
var import_dayjs = __toESM(require("dayjs"));

// src/modules/events/use-cases/errors/invalid-date-interval-error.ts
var InvalidDateIntervalError = class extends AppError {
  constructor() {
    super("Invalid date interval.", 403);
  }
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
    const event = await this.eventsRepository.create({
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
  const bodySchema = import_zod4.z.object({
    title: import_zod4.z.string(),
    description: import_zod4.z.string().optional(),
    start_date: import_zod4.z.coerce.date(),
    end_date: import_zod4.z.coerce.date().optional()
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

// src/modules/events/http/controllers/events/get-event-controller.ts
var import_zod5 = require("zod");

// src/modules/events/use-cases/errors/resource-not-found-error.ts
var ResourceNotFoundError2 = class extends AppError {
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
      throw new ResourceNotFoundError2();
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
  const paramsSchema = import_zod5.z.object({
    id: import_zod5.z.string().uuid()
  }).strict();
  const { id } = paramsSchema.parse(request.params);
  const getEvent = makeGetEventEventUseCase();
  const { event } = await getEvent.execute({ id });
  return reply.status(200).send({ event });
}

// src/modules/events/http/controllers/events/update-event-controller.ts
var import_zod6 = require("zod");

// src/modules/events/use-cases/update-event-use-case.ts
var import_dayjs2 = __toESM(require("dayjs"));
var UpdateEventUseCase = class {
  constructor(eventsRepository) {
    this.eventsRepository = eventsRepository;
  }
  async execute(id, { title, description, start_date, end_date }) {
    const event = await this.eventsRepository.findById(id);
    if (!event)
      throw new ResourceNotFoundError2();
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
  const paramsSchema = import_zod6.z.object({
    id: import_zod6.z.string().uuid()
  }).strict();
  const bodySchema = import_zod6.z.object({
    title: import_zod6.z.string().optional(),
    description: import_zod6.z.string().optional(),
    start_date: import_zod6.z.coerce.date().optional(),
    end_date: import_zod6.z.coerce.date().optional()
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
  app.get("/events/", listEventsController);
  const middlewares = {
    onRequest: [verifyJWT, verifyUserRole("ADMINISTRATOR")]
  };
  app.post("/events", middlewares, createEventController);
  app.put("/events/:id", middlewares, updateEventController);
}

// src/modules/users/http/controllers/refresh.ts
async function refresh(request, reply) {
  await request.jwtVerify({
    onlyCookie: true
  });
  const { role } = request.user;
  const token = await reply.jwtSign(
    { role },
    { sign: { sub: request.user.sub } }
  );
  const refreshToken = await reply.jwtSign(
    { role },
    { sign: { sub: request.user.sub, expiresIn: "7d" } }
  );
  return reply.setCookie("refreshToken", refreshToken, {
    path: "/",
    secure: true,
    sameSite: true,
    httpOnly: true
  }).status(200).send({
    token
  });
}

// src/modules/users/http/routes/token-routes.ts
async function tokenRoutes(app) {
  app.patch("/token/refresh", refresh);
}

// src/modules/addresses/http/controllers/update-address-controller.ts
var import_zod7 = require("zod");

// src/modules/addresses/repositories/prisma/prisma-addresses-repository.ts
var PrismaAddressesRepository = class {
  async findById(id) {
    const address = await prisma.address.findUnique({
      where: { id }
    });
    return address;
  }
  async create(data) {
    const address = await prisma.address.create({
      data
    });
    return address;
  }
  async save(data) {
    const address = await prisma.address.update({
      where: { id: data.id },
      data
    });
    return address;
  }
};

// src/modules/addresses/use-cases/errors/resource-not-found-error.ts
var ResourceNotFoundError3 = class extends AppError {
  constructor() {
    super("Resource not found.", 404);
  }
};

// src/modules/addresses/use-cases/update-address-use-case.ts
var UpdateAddressUseCase = class {
  constructor(addressesRepository) {
    this.addressesRepository = addressesRepository;
  }
  async execute(id, {
    street,
    street_number,
    complement,
    zip_code,
    district,
    city,
    state
  }) {
    const address = await this.addressesRepository.findById(id);
    if (!address)
      throw new ResourceNotFoundError3();
    if (street)
      address.street = street;
    if (street_number)
      address.street_number = street_number;
    if (complement)
      address.complement = complement;
    if (zip_code)
      address.zip_code = zip_code;
    if (district)
      address.district = district;
    if (city)
      address.city = city;
    if (state)
      address.state = state;
    await this.addressesRepository.save(address);
    return { address };
  }
};

// src/modules/addresses/use-cases/factories/make-update-address-use-case.ts
function makeUpdateAddressUseCase() {
  const addressesRepository = new PrismaAddressesRepository();
  const useCase = new UpdateAddressUseCase(addressesRepository);
  return useCase;
}

// src/modules/addresses/http/controllers/update-address-controller.ts
async function updateAddressController(request, reply) {
  const paramsSchema = import_zod7.z.object({
    id: import_zod7.z.string().uuid()
  }).strict();
  const bodySchema = import_zod7.z.object({
    street: import_zod7.z.string().optional(),
    street_number: import_zod7.z.string().optional(),
    complement: import_zod7.z.string().optional(),
    zip_code: import_zod7.z.string().optional(),
    district: import_zod7.z.string().optional(),
    city: import_zod7.z.string().optional(),
    state: import_zod7.z.string().optional()
  }).strict();
  const { id } = paramsSchema.parse(request.params);
  const { street, street_number, complement, zip_code, district, city, state } = bodySchema.parse(request.body);
  const updateAddress = makeUpdateAddressUseCase();
  const { address } = await updateAddress.execute(id, {
    street,
    street_number,
    complement,
    zip_code,
    district,
    city,
    state
  });
  return reply.status(200).send({ address });
}

// src/modules/addresses/http/controllers/create-address-to-event-controller.ts
var import_zod8 = require("zod");

// src/modules/addresses/use-cases/errors/already-has-address-error.ts
var AlreadyHasAddressError = class extends AppError {
  constructor() {
    super("Resource already has a registered address", 409);
  }
};

// src/modules/addresses/use-cases/create-address-to-event-use-case.ts
var CreateAddressToEventUseCase = class {
  constructor(addressesRepository, eventsRepository) {
    this.addressesRepository = addressesRepository;
    this.eventsRepository = eventsRepository;
  }
  async execute({
    event_id,
    street,
    street_number,
    complement,
    zip_code,
    district,
    city,
    state
  }) {
    const event = await this.eventsRepository.findByIdWithRelations(event_id);
    if (!event)
      throw new ResourceNotFoundError3();
    if (event?.addresses && event.addresses.length > 0)
      throw new AlreadyHasAddressError();
    const address = await this.addressesRepository.create({
      street,
      street_number,
      complement,
      zip_code,
      district,
      city,
      state,
      events: {
        connect: {
          id: event.id
        }
      }
    });
    return { address };
  }
};

// src/modules/addresses/use-cases/factories/make-create-address-to-event-use-case.ts
function makeCreateAddressToEventUseCase() {
  const addressesRepository = new PrismaAddressesRepository();
  const eventsRepository = new PrismaEventsRepository();
  const useCase = new CreateAddressToEventUseCase(
    addressesRepository,
    eventsRepository
  );
  return useCase;
}

// src/modules/addresses/http/controllers/create-address-to-event-controller.ts
async function createAddressToEventController(request, reply) {
  const paramsSchema = import_zod8.z.object({
    event_id: import_zod8.z.string().uuid()
  }).strict();
  const bodySchema = import_zod8.z.object({
    street: import_zod8.z.string(),
    street_number: import_zod8.z.string(),
    complement: import_zod8.z.string().optional(),
    zip_code: import_zod8.z.string(),
    district: import_zod8.z.string(),
    city: import_zod8.z.string(),
    state: import_zod8.z.string()
  }).strict();
  const { event_id } = paramsSchema.parse(request.params);
  const { street, street_number, complement, zip_code, district, city, state } = bodySchema.parse(request.body);
  const createAddress = makeCreateAddressToEventUseCase();
  const { address } = await createAddress.execute({
    event_id,
    street,
    street_number,
    complement,
    zip_code,
    district,
    city,
    state
  });
  return reply.status(200).send({ address });
}

// src/modules/addresses/http/controllers/get-address-controller.ts
var import_zod9 = require("zod");

// src/modules/addresses/use-cases/get-address-use-case.ts
var GetAddressUseCase = class {
  constructor(addressesRepository) {
    this.addressesRepository = addressesRepository;
  }
  async execute({ id }) {
    const address = await this.addressesRepository.findById(id);
    if (!address)
      throw new ResourceNotFoundError3();
    return { address };
  }
};

// src/modules/addresses/use-cases/factories/make-get-address-use-case.ts
function makeGetAddressEventUseCase() {
  const addressesRepository = new PrismaAddressesRepository();
  const useCase = new GetAddressUseCase(addressesRepository);
  return useCase;
}

// src/modules/addresses/http/controllers/get-address-controller.ts
async function getAddressController(request, reply) {
  const paramsSchema = import_zod9.z.object({
    id: import_zod9.z.string().uuid()
  }).strict();
  const { id } = paramsSchema.parse(request.params);
  const getAddress = makeGetAddressEventUseCase();
  const { address } = await getAddress.execute({ id });
  return reply.status(200).send({ address });
}

// src/modules/addresses/http/routes/address-routes.ts
async function addressRoutes(app) {
  app.addHook("onRequest", verifyJWT);
  app.addHook("onRequest", verifyUserRole("ADMINISTRATOR"));
  app.post("/addresses/event/:event_id", createAddressToEventController);
  app.get("/addresses/:id", getAddressController);
  app.put("/addresses/:id", updateAddressController);
}

// src/modules/event-tickets/http/controllers/create-ticket-controller.ts
var import_zod10 = require("zod");

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

// src/modules/event-tickets/use-cases/errors/resource-not-found-error.ts
var ResourceNotFoundError4 = class extends AppError {
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
      throw new ResourceNotFoundError4();
    const ticket = await this.ticketsRepository.create({
      event_id,
      title,
      price,
      expires_in
    });
    if (!ticket)
      throw new ResourceNotFoundError4();
    return { ticket };
  }
};

// src/modules/event-tickets/use-cases/factories/make-create-ticket-use-case.ts
function makeCreateTicketUseCase() {
  const ticketsRepository = new PrismaTicketsRepository();
  const eventsRepository = new PrismaEventsRepository();
  const useCase = new CreateTicketUseCase(ticketsRepository, eventsRepository);
  return useCase;
}

// src/modules/event-tickets/http/controllers/create-ticket-controller.ts
async function createTicketController(request, reply) {
  const paramsSchema = import_zod10.z.object({
    event_id: import_zod10.z.string().uuid()
  }).strict();
  const bodySchema = import_zod10.z.object({
    title: import_zod10.z.string(),
    price: import_zod10.z.number().positive(),
    expires_in: import_zod10.z.coerce.date().optional()
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
var import_zod11 = require("zod");

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
  const paramsSchema = import_zod11.z.object({
    event_id: import_zod11.z.string().uuid()
  }).strict();
  const { event_id } = paramsSchema.parse(request.params);
  const listTickets = makeListTicketsByEventUseCase();
  const { tickets } = await listTickets.execute({ event_id });
  return reply.status(200).send({ tickets });
}

// src/modules/event-tickets/http/controllers/update-ticket-controller.ts
var import_zod12 = require("zod");

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
  const paramsSchema = import_zod12.z.object({
    id: import_zod12.z.string().uuid()
  }).strict();
  const bodySchema = import_zod12.z.object({
    title: import_zod12.z.string().optional(),
    price: import_zod12.z.number().optional(),
    expires_in: import_zod12.z.coerce.date().optional()
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

// src/modules/event-registrations/http/controllers/create-registration-controller.ts
var import_zod13 = require("zod");

// src/modules/event-registrations/repositories/prisma/prisma-registrations-repository.ts
var PrismaRegistrationsRepository = class {
  async findById(id) {
    const registration = await prisma.eventRegistration.findUnique({
      where: { id }
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
      where: { event_id }
    });
    return registrations;
  }
  async findManyByUser(user_id) {
    const registrations = await prisma.eventRegistration.findMany({
      where: { user_id }
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

// src/modules/event-registrations/use-cases/errors/resource-not-found-error.ts
var ResourceNotFoundError5 = class extends AppError {
  constructor() {
    super("Resource not found.", 404);
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
      throw new ResourceNotFoundError5();
    const userExists = await this.usersRepository.findById(user_id);
    if (!userExists)
      throw new ResourceNotFoundError5();
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
  const paramsSchema = import_zod13.z.object({
    event_id: import_zod13.z.string().uuid()
  }).strict();
  const bodySchema = import_zod13.z.object({
    full_name: import_zod13.z.string().min(5),
    phone_number: import_zod13.z.string(),
    age: import_zod13.z.number().int().positive(),
    document_number: import_zod13.z.string(),
    document_type: import_zod13.z.enum(["CPF", "RG"]),
    guardian_name: import_zod13.z.string().optional(),
    guardian_phone_number: import_zod13.z.string().optional(),
    prayer_group: import_zod13.z.string().optional(),
    event_source: import_zod13.z.string().optional(),
    community_type: import_zod13.z.enum(["VIDA", "ALIAN\xC7A"]).optional(),
    pcd_description: import_zod13.z.string().optional(),
    allergy_description: import_zod13.z.string().optional(),
    transportation_mode: import_zod13.z.enum(["TRANSPORTE PR\xD3PRIO", "\xD4NIBUS"]),
    accepted_the_terms: import_zod13.z.boolean().refine((value) => value === true, {
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
var import_zod14 = require("zod");

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
  const paramsSchema = import_zod14.z.object({
    event_id: import_zod14.z.string().uuid()
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
var import_zod15 = require("zod");

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
      throw new ResourceNotFoundError5();
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
  const paramsSchema = import_zod15.z.object({
    registration_id: import_zod15.z.string().uuid()
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
var import_zod16 = require("zod");

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

// src/modules/payments/use-cases/errors/resource-not-found-error.ts
var ResourceNotFoundError6 = class extends AppError {
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
      throw new ResourceNotFoundError6();
    const ticket = await this.ticketsRepository.findById(event_ticket_id);
    if (!ticket)
      throw new ResourceNotFoundError6();
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
  const paramsSchema = import_zod16.z.object({
    event_registration_id: import_zod16.z.string().uuid()
  }).strict();
  const bodySchema = import_zod16.z.object({
    event_ticket_id: import_zod16.z.string().uuid(),
    payment_method: import_zod16.z.string(),
    price: import_zod16.z.coerce.number().positive()
  }).strict();
  const user_id = request.user.sub;
  const file = request.file;
  const { event_registration_id } = paramsSchema.parse(request.params);
  const { event_ticket_id, payment_method, price } = bodySchema.parse(
    request.body
  );
  const createPayment = makeCreatePaymentUseCase();
  const { payment } = await createPayment.execute({
    user_id,
    event_registration_id,
    event_ticket_id,
    payment_method,
    price,
    file: String(file.filename)
  });
  return reply.status(200).send({ payment });
}

// src/modules/payments/http/controllers/update-payment-status-controller.ts
var import_zod17 = require("zod");

// src/modules/payments/use-cases/update-payment-status-use-case.ts
var UpdatePaymentStatusUseCase = class {
  constructor(paymentsRepository) {
    this.paymentsRepository = paymentsRepository;
  }
  async execute({ payment_id }) {
    const payment = await this.paymentsRepository.findById(payment_id);
    if (!payment)
      throw new ResourceNotFoundError6();
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
  const paramsSchema = import_zod17.z.object({
    id: import_zod17.z.string().uuid()
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

// src/shared/infra/http/routes.ts
async function appRoutes(app) {
  app.register(userRoutes);
  app.register(sessionsRoutes);
  app.register(profileRoutes);
  app.register(eventsRoutes);
  app.register(tokenRoutes);
  app.register(addressRoutes);
  app.register(ticketsRoutes);
  app.register(registrationsRoutes);
  app.register(paymentsRoutes);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  appRoutes
});
