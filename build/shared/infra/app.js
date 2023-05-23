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

// src/shared/infra/app.ts
var app_exports = {};
__export(app_exports, {
  app: () => app
});
module.exports = __toCommonJS(app_exports);
var import_fastify = __toESM(require("fastify"));
var import_jwt = __toESM(require("@fastify/jwt"));
var import_cookie = __toESM(require("@fastify/cookie"));
var import_fastify_multer3 = __toESM(require("fastify-multer"));
var import_static = __toESM(require("@fastify/static"));
var import_cors = __toESM(require("@fastify/cors"));

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

// src/config/auth.ts
var auth_default = {
  jwt: {
    secret: env.JWT_SECRET,
    cookie: {
      cookieName: "refreshToken",
      signed: false
    },
    sign: {
      expiresIn: "1d"
    }
  }
};

// src/modules/users/http/controllers/authenticate.ts
var import_zod2 = require("zod");

// src/shared/lib/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient({
  log: env.NODE_ENV === "dev" ? ["query"] : []
});

// src/modules/users/repositories/prisma/prisma-users-repository.ts
var PrismaUsersRepository = class {
  async findById(id) {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { participant: true }
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
  async findByIdWithRelations(id) {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { addresses: true }
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
async function sessionsRoutes(app2) {
  app2.post("/sessions", authenticate);
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
    password: import_zod3.z.string().min(8),
    password_confirmation: import_zod3.z.string().min(8)
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
async function userRoutes(app2) {
  app2.post("/users", register);
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
async function profileRoutes(app2) {
  app2.get("/profile", { onRequest: [verifyJWT] }, profile);
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

// src/shared/utils/generate-slug.ts
var generateSlug = ({
  keyword,
  separator = "-",
  withHash = false,
  hash: hash3
}) => {
  const slug = `${keyword.toLowerCase()}`.replace(
    /([^a-z0-9 ]+)|\s/gi,
    separator
  );
  if (!withHash)
    return slug;
  const hashCode = hash3 ?? String((/* @__PURE__ */ new Date()).getTime()).substring(8);
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
  const paramsSchema = import_zod6.z.object({
    id: import_zod6.z.string().uuid()
  }).strict();
  const bodySchema = import_zod6.z.object({
    slug: import_zod6.z.string().optional(),
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
async function eventsRoutes(app2) {
  app2.get("/events/:id", getEventController);
  app2.get("/events", listEventsController);
  const middlewares = {
    onRequest: [verifyJWT, verifyUserRole("ADMINISTRATOR")]
  };
  app2.post("/events", middlewares, createEventController);
  app2.put("/events/:id", middlewares, updateEventController);
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
async function tokenRoutes(app2) {
  app2.patch("/token/refresh", refresh);
}

// src/modules/addresses/http/controllers/update-address-to-event-controller.ts
var import_zod7 = require("zod");

// src/modules/addresses/repositories/prisma/prisma-addresses-repository.ts
var PrismaAddressesRepository = class {
  async findById(id) {
    const address = await prisma.address.findFirst({
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
  async findManyByUser(user_id) {
    const addresses = await prisma.address.findMany({
      where: { users: { some: { id: user_id } } }
    });
    return addresses;
  }
  async findManyByEvent(event_id) {
    const addresses = await prisma.address.findMany({
      where: { events: { some: { id: event_id } } }
    });
    return addresses;
  }
  async findByEvent(address_id, event_id) {
    const address = await prisma.address.findFirst({
      where: { id: address_id, events: { every: { id: event_id } } }
    });
    return address;
  }
};

// src/modules/addresses/use-cases/errors/already-has-address-error.ts
var AlreadyHasAddressError = class extends AppError {
  constructor() {
    super("Resource already has a registered address", 409);
  }
};

// src/modules/addresses/use-cases/errors/resource-not-found-error.ts
var ResourceNotFoundError3 = class extends AppError {
  constructor(resource) {
    super(`${resource ?? "Resource"} not found.`, 404);
  }
};

// src/modules/addresses/use-cases/errors/user-is-not-participant-error.ts
var UserIsNotParticipantError = class extends AppError {
  constructor() {
    super("User is not participant.", 403);
  }
};

// src/modules/addresses/use-cases/update-address-to-event-use-case.ts
var UpdateAddressToEventUseCase = class {
  constructor(addressesRepository) {
    this.addressesRepository = addressesRepository;
  }
  async execute({
    event_id,
    address_id,
    street,
    street_number,
    complement,
    zip_code,
    district,
    city,
    state
  }) {
    const address = await this.addressesRepository.findByEvent(
      address_id,
      event_id
    );
    if (!address)
      throw new ResourceNotFoundError3("Address");
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

// src/modules/addresses/use-cases/factories/make-update-address-to-event-use-case.ts
function makeUpdateAddressToEventUseCase() {
  const addressesRepository = new PrismaAddressesRepository();
  const useCase = new UpdateAddressToEventUseCase(addressesRepository);
  return useCase;
}

// src/modules/addresses/http/controllers/update-address-to-event-controller.ts
async function updateAddressToEventController(request, reply) {
  const paramsSchema = import_zod7.z.object({
    address_id: import_zod7.z.string().uuid(),
    event_id: import_zod7.z.string().uuid()
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
  const { address_id, event_id } = paramsSchema.parse(request.params);
  const { street, street_number, complement, zip_code, district, city, state } = bodySchema.parse(request.body);
  const updateAddress = makeUpdateAddressToEventUseCase();
  const { address } = await updateAddress.execute({
    address_id,
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

// src/modules/addresses/http/controllers/create-address-to-event-controller.ts
var import_zod8 = require("zod");

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
      throw new ResourceNotFoundError3("User");
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
      throw new ResourceNotFoundError3("Event");
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

// src/modules/addresses/http/controllers/list-addresses-by-event-controller.ts
var import_zod10 = require("zod");

// src/modules/addresses/use-cases/list-addresses-by-event-use-case.ts
var ListAddressesByEventUseCase = class {
  constructor(addressesRepository) {
    this.addressesRepository = addressesRepository;
  }
  async execute({ event_id }) {
    const addresses = await this.addressesRepository.findManyByEvent(event_id);
    return { addresses };
  }
};

// src/modules/addresses/use-cases/factories/make-list-addresses-by-event-use-case.ts
function makeListAddressesByEventUseCase() {
  const addressesRepository = new PrismaAddressesRepository();
  const useCase = new ListAddressesByEventUseCase(addressesRepository);
  return useCase;
}

// src/modules/addresses/http/controllers/list-addresses-by-event-controller.ts
async function listAddressesByEventController(request, reply) {
  const paramsSchema = import_zod10.z.object({
    event_id: import_zod10.z.string().uuid()
  }).strict();
  const { event_id } = paramsSchema.parse(request.params);
  const listAddresses = makeListAddressesByEventUseCase();
  const { addresses } = await listAddresses.execute({ event_id });
  return reply.status(200).send({ addresses });
}

// src/modules/addresses/http/routes/event-addresses-routes.ts
async function eventAddressesRoutes(app2) {
  app2.get("/addresses/:id", getAddressController);
  const adminMiddlewares = {
    onRequest: [verifyJWT, verifyUserRole("ADMINISTRATOR")]
  };
  app2.post(
    "/addresses/event/:event_id",
    adminMiddlewares,
    createAddressToEventController
  );
  app2.put(
    "/addresses/:address_id/event/:event_id",
    adminMiddlewares,
    updateAddressToEventController
  );
  app2.get(
    "/addresses/event/:event_id",
    adminMiddlewares,
    listAddressesByEventController
  );
}

// src/modules/addresses/http/controllers/update-address-to-participant-controller.ts
var import_zod11 = require("zod");

// src/modules/addresses/use-cases/update-address-to-participant-use-case.ts
var UpdateAddressToParticipantUseCase = class {
  constructor(addressesRepository, usersRepository) {
    this.addressesRepository = addressesRepository;
    this.usersRepository = usersRepository;
  }
  async execute({
    address_id,
    user_id,
    street,
    street_number,
    complement,
    zip_code,
    district,
    city,
    state
  }) {
    const userParticipant = await this.usersRepository.findByIdWithRelations(
      user_id
    );
    if (!userParticipant)
      throw new ResourceNotFoundError3("User");
    if (userParticipant.role !== "PARTICIPANT")
      throw new UserIsNotParticipantError();
    if (userParticipant?.addresses && userParticipant.addresses.length === 0)
      throw new ResourceNotFoundError3("Address");
    const address = userParticipant.addresses.find(
      (address2) => address2.id === address_id
    );
    if (!address)
      throw new ResourceNotFoundError3("Address");
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

// src/modules/addresses/use-cases/factories/make-update-address-to-participant-use-case.ts
function makeUpdateAddressToParticipantUseCase() {
  const addressesRepository = new PrismaAddressesRepository();
  const usersRepository = new PrismaUsersRepository();
  const useCase = new UpdateAddressToParticipantUseCase(
    addressesRepository,
    usersRepository
  );
  return useCase;
}

// src/modules/addresses/http/controllers/update-address-to-participant-controller.ts
async function updateAddressToParticipantController(request, reply) {
  const user_id = request?.user?.sub;
  const paramsSchema = import_zod11.z.object({
    id: import_zod11.z.string().uuid()
  }).strict();
  const bodySchema = import_zod11.z.object({
    street: import_zod11.z.string().optional(),
    street_number: import_zod11.z.string().optional(),
    complement: import_zod11.z.string().optional(),
    zip_code: import_zod11.z.string().optional(),
    district: import_zod11.z.string().optional(),
    city: import_zod11.z.string().optional(),
    state: import_zod11.z.string().optional()
  }).strict();
  const { id } = paramsSchema.parse(request.params);
  const { street, street_number, complement, zip_code, district, city, state } = bodySchema.parse(request.body);
  const updateAddress = makeUpdateAddressToParticipantUseCase();
  const { address } = await updateAddress.execute({
    address_id: id,
    user_id,
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

// src/modules/addresses/use-cases/list-addresses-by-participant-use-case.ts
var ListAddressesByParticipantUseCase = class {
  constructor(addressesRepository) {
    this.addressesRepository = addressesRepository;
  }
  async execute({ user_id }) {
    const addresses = await this.addressesRepository.findManyByUser(user_id);
    return { addresses };
  }
};

// src/modules/addresses/use-cases/factories/make-list-addresses-by-participant-use-case.ts
function makeListAddressesByParticipantUseCase() {
  const addressesRepository = new PrismaAddressesRepository();
  const useCase = new ListAddressesByParticipantUseCase(addressesRepository);
  return useCase;
}

// src/modules/addresses/http/controllers/list-addresses-by-participant-controller.ts
async function listAddressesByParticipantController(request, reply) {
  const user_id = request?.user?.sub;
  const listAddresses = makeListAddressesByParticipantUseCase();
  const { addresses } = await listAddresses.execute({ user_id });
  return reply.status(200).send({ addresses });
}

// src/modules/addresses/http/controllers/create-address-to-participant-controller.ts
var import_zod12 = require("zod");

// src/modules/addresses/use-cases/create-address-to-participant-use-case.ts
var CreateAddressToParticipantUseCase = class {
  constructor(addressesRepository, usersRepository) {
    this.addressesRepository = addressesRepository;
    this.usersRepository = usersRepository;
  }
  async execute({
    user_id,
    street,
    street_number,
    complement,
    zip_code,
    district,
    city,
    state
  }) {
    const userParticipant = await this.usersRepository.findByIdWithRelations(
      user_id
    );
    if (!userParticipant)
      throw new ResourceNotFoundError3("User");
    if (userParticipant.role !== "PARTICIPANT")
      throw new UserIsNotParticipantError();
    if (userParticipant?.addresses && userParticipant.addresses.length > 0)
      throw new AlreadyHasAddressError();
    const address = await this.addressesRepository.create({
      street,
      street_number,
      complement,
      zip_code,
      district,
      city,
      state,
      users: {
        connect: {
          id: userParticipant.id
        }
      }
    });
    return { address };
  }
};

// src/modules/addresses/use-cases/factories/make-create-address-to-participant-use-case.ts
function makeCreateAddressToParticipantUseCase() {
  const addressesRepository = new PrismaAddressesRepository();
  const usersRepository = new PrismaUsersRepository();
  const useCase = new CreateAddressToParticipantUseCase(
    addressesRepository,
    usersRepository
  );
  return useCase;
}

// src/modules/addresses/http/controllers/create-address-to-participant-controller.ts
async function createAddressToParticipantController(request, reply) {
  const user_id = request?.user?.sub;
  const bodySchema = import_zod12.z.object({
    street: import_zod12.z.string(),
    street_number: import_zod12.z.string(),
    complement: import_zod12.z.string().optional(),
    zip_code: import_zod12.z.string(),
    district: import_zod12.z.string(),
    city: import_zod12.z.string(),
    state: import_zod12.z.string()
  }).strict();
  const { street, street_number, complement, zip_code, district, city, state } = bodySchema.parse(request.body);
  const createAddress = makeCreateAddressToParticipantUseCase();
  const { address } = await createAddress.execute({
    user_id,
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

// src/modules/addresses/http/routes/participant-addresses-routes.ts
async function participantAddressesRoutes(app2) {
  const participantMiddlewares = {
    onRequest: [verifyJWT, verifyUserRole("PARTICIPANT")]
  };
  app2.post(
    "/addresses/participant",
    participantMiddlewares,
    createAddressToParticipantController
  );
  app2.put(
    "/addresses/:id/participant",
    participantMiddlewares,
    updateAddressToParticipantController
  );
  app2.get(
    "/addresses/participant",
    participantMiddlewares,
    listAddressesByParticipantController
  );
}

// src/modules/addresses/http/routes/index.ts
async function addressesRoutes(app2) {
  app2.register(eventAddressesRoutes);
  app2.register(participantAddressesRoutes);
}

// src/modules/event-tickets/http/controllers/create-ticket-controller.ts
var import_zod13 = require("zod");

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

// src/modules/event-tickets/use-cases/create-ticket-use-case.ts
var import_dayjs3 = __toESM(require("dayjs"));

// src/modules/event-tickets/use-cases/errors/event-not-found-error.ts
var EventNotFoundError = class extends AppError {
  constructor() {
    super("Event not found.", 404);
  }
};

// src/modules/event-tickets/use-cases/errors/ticket-not-found-or-expired-error.ts
var TicketNotFoundOrExpiredError = class extends AppError {
  constructor() {
    super("Ticket not found or Expired.", 404);
  }
};

// src/modules/event-tickets/use-cases/errors/expires-in-cannot-be-after-event-end-date-error.ts
var ExpiresInCannotBeAfterEventEndDateError = class extends AppError {
  constructor() {
    super("Expires In cannot be after event end date.", 403);
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
      throw new EventNotFoundError();
    if ((0, import_dayjs3.default)(expires_in).isAfter(eventExists.end_date))
      throw new ExpiresInCannotBeAfterEventEndDateError();
    const ticket = await this.ticketsRepository.create({
      event_id,
      title,
      price,
      expires_in
    });
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
  const paramsSchema = import_zod13.z.object({
    event_id: import_zod13.z.string().uuid()
  }).strict();
  const bodySchema = import_zod13.z.object({
    title: import_zod13.z.string(),
    price: import_zod13.z.number().positive(),
    expires_in: import_zod13.z.coerce.date().optional()
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
var import_zod14 = require("zod");

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
  const paramsSchema = import_zod14.z.object({
    event_id: import_zod14.z.string().uuid()
  }).strict();
  const { event_id } = paramsSchema.parse(request.params);
  const listTickets = makeListTicketsByEventUseCase();
  const { tickets } = await listTickets.execute({ event_id });
  return reply.status(200).send({ tickets });
}

// src/modules/event-tickets/http/controllers/update-ticket-controller.ts
var import_zod15 = require("zod");

// src/modules/event-tickets/use-cases/update-ticket-use-case.ts
var import_client2 = require("@prisma/client");
var UpdateEventTicketUseCase = class {
  constructor(ticketsRepository) {
    this.ticketsRepository = ticketsRepository;
  }
  async execute(id, { title, price, expires_in }) {
    const ticket = await this.ticketsRepository.findByIdIfEventNotExpired(id);
    if (!ticket)
      throw new TicketNotFoundOrExpiredError();
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
  const paramsSchema = import_zod15.z.object({
    id: import_zod15.z.string().uuid()
  }).strict();
  const bodySchema = import_zod15.z.object({
    title: import_zod15.z.string().optional(),
    price: import_zod15.z.number().optional(),
    expires_in: import_zod15.z.coerce.date().optional()
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
async function ticketsRoutes(app2) {
  app2.get("/tickets/event/:event_id", listTicketsByEventController);
  const middlewares = {
    onRequest: [verifyJWT, verifyUserRole("ADMINISTRATOR")]
  };
  app2.post("/tickets/event/:event_id", middlewares, createTicketController);
  app2.put("/tickets/:id", middlewares, updateTicketController);
}

// src/modules/event-registrations/http/controllers/list-registrations-by-event-controller.ts
var import_zod16 = require("zod");

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
        user: { select: { email: true, participant: true } },
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
    const registration = await prisma.eventRegistration.update({
      where: { id: data.id },
      data
    });
    return registration;
  }
};

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
  const paramsSchema = import_zod16.z.object({
    event_id: import_zod16.z.string().uuid()
  }).strict();
  const { event_id } = paramsSchema.parse(request.params);
  const listRegistrationsByEvent = makeListRegistrationsByEventUseCase();
  const { registrations } = await listRegistrationsByEvent.execute({
    event_id
  });
  return reply.status(200).send({ registrations });
}

// src/modules/event-registrations/http/controllers/validate-registration-controller.ts
var import_zod17 = require("zod");

// src/modules/event-registrations/use-cases/errors/resource-not-found-error.ts
var ResourceNotFoundError4 = class extends AppError {
  constructor(resource) {
    super(`${resource ?? "Resource"} not found.`, 404);
  }
};

// src/modules/event-registrations/use-cases/errors/user-already-registered-error.ts
var UserAlreadyRegisteredError = class extends AppError {
  constructor() {
    super("User is already registered for this event", 409);
  }
};

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
      throw new ResourceNotFoundError4("Registration");
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
  const paramsSchema = import_zod17.z.object({
    registration_id: import_zod17.z.string().uuid()
  }).strict();
  const { registration_id } = paramsSchema.parse(request.params);
  const validateRegistration = makeValidateRegistrationUseCase();
  const { registration } = await validateRegistration.execute({
    registration_id
  });
  return reply.status(200).send({ registration });
}

// src/modules/event-registrations/http/controllers/export-registrations-controller.ts
var csv = __toESM(require("fast-csv"));
var import_dayjs4 = __toESM(require("dayjs"));
var import_zod18 = require("zod");

// src/shared/utils/translate-payment-status.ts
var translateStatus = {
  waiting: "Aguardando pagamento",
  sent: "Enviado",
  approved: "Aprovado",
  refused: "Recusado"
};
function translatePaymentStatus(originalStatus = "waiting") {
  return translateStatus[originalStatus];
}

// src/modules/event-registrations/http/controllers/export-registrations-controller.ts
async function exportRegistrationsController(request, reply) {
  const paramsSchema = import_zod18.z.object({
    event_id: import_zod18.z.string().uuid()
  }).strict();
  const { event_id } = paramsSchema.parse(request.params);
  try {
    const listRegistrations = makeListRegistrationsByEventUseCase();
    const { registrations } = await listRegistrations.execute({ event_id });
    const csvStream = csv.format({ headers: true });
    registrations.forEach((registration) => {
      const participantData = registration?.user?.participant;
      csvStream.write({
        Evento: registration?.event?.title ?? "-",
        NomeCompleto: participantData?.full_name,
        NomeCredencial: registration.credential_name,
        Email: registration?.user?.email,
        Telefone: participantData?.phone_number,
        NumeroDocumento: participantData?.document_number,
        TipoDocumento: participantData?.document_type,
        DataNascimento: participantData?.birthdate ? (0, import_dayjs4.default)(participantData?.birthdate).format("DD/MM/YYYY") : "-",
        Idade: participantData?.birthdate ? (0, import_dayjs4.default)(/* @__PURE__ */ new Date()).diff(participantData?.birthdate, "years") : "-",
        NomeResponsavel: participantData?.guardian_name,
        TelefoneResponsavel: participantData?.guardian_phone_number,
        GrupoOracao: participantData?.prayer_group,
        TipoComunidade: participantData?.community_type,
        PCD: participantData?.pcd_description,
        Alergias: participantData?.allergy_description,
        MeioDeTransporte: registration.transportation_mode,
        ComoSoubeDoEvento: registration.event_source,
        InscricaoAprovada: registration.is_approved ? "Sim" : "N\xE3o",
        ComprovantePagamento: translatePaymentStatus(
          registration.payment?.status
        ),
        CheckIn: registration.checked_in ? "Sim" : "N\xE3o"
      });
    });
    csvStream.end();
    reply.header("Content-Type", "text/csv");
    reply.header(
      "Content-Disposition",
      "attachment; filename=participants.csv"
    );
    reply.send(csvStream);
    return reply;
  } catch (error) {
    reply.status(500).send(error);
  }
}

// src/modules/event-registrations/http/routes/admin-registrations-routes.ts
async function adminRegistrationsRoutes(app2) {
  const adminMiddlewares = {
    onRequest: [verifyJWT, verifyUserRole("ADMINISTRATOR")]
  };
  app2.get(
    "/registrations/export/event/:event_id",
    adminMiddlewares,
    exportRegistrationsController
  );
  app2.get(
    "/registrations/event/:event_id",
    adminMiddlewares,
    listRegistrationsByEventController
  );
  app2.patch(
    "/registrations/:registration_id/approve",
    adminMiddlewares,
    validateRegistrationController
  );
}

// src/modules/event-registrations/http/controllers/create-registration-controller.ts
var import_zod19 = require("zod");

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
    event_source,
    transportation_mode,
    accepted_the_terms,
    credential_name
  }) {
    const eventExists = await this.eventsRepository.findById(event_id);
    if (!eventExists)
      throw new ResourceNotFoundError4("Event");
    const userExists = await this.usersRepository.findById(user_id);
    if (!userExists)
      throw new ResourceNotFoundError4("User");
    const registrationExtist = await this.registrationsRepository.findByEventAndUser(event_id, user_id);
    if (registrationExtist)
      throw new UserAlreadyRegisteredError();
    const registration = await this.registrationsRepository.create({
      user_id,
      event_id,
      event_source,
      transportation_mode,
      accepted_the_terms,
      credential_name
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
  const paramsSchema = import_zod19.z.object({
    event_id: import_zod19.z.string().uuid()
  }).strict();
  const bodySchema = import_zod19.z.object({
    credential_name: import_zod19.z.string().min(5).max(18),
    event_source: import_zod19.z.string().optional(),
    transportation_mode: import_zod19.z.enum(["TRANSPORTE PR\xD3PRIO", "\xD4NIBUS"]),
    accepted_the_terms: import_zod19.z.boolean().refine((value) => value === true, {
      message: "User must accept the terms",
      path: ["accepted_the_terms"]
    })
  }).strict();
  const user_id = request.user.sub;
  const { event_id } = paramsSchema.parse(request.params);
  const {
    event_source,
    transportation_mode,
    accepted_the_terms,
    credential_name
  } = bodySchema.parse(request.body);
  const createEventRegistration = makeCreateEventRegistrationUseCase();
  const { registration } = await createEventRegistration.execute({
    user_id,
    event_id,
    event_source,
    transportation_mode,
    accepted_the_terms,
    credential_name
  });
  return reply.status(200).send({ registration });
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

// src/modules/event-registrations/http/routes/participant-registrations-routes.ts
async function participantRegistrationsRoutes(app2) {
  const participantMiddlewares = {
    onRequest: [verifyJWT, verifyUserRole("PARTICIPANT")]
  };
  app2.post(
    "/registrations/event/:event_id",
    participantMiddlewares,
    createRegistrationController
  );
  app2.get(
    "/registrations/my",
    participantMiddlewares,
    listRegistrationsByUserController
  );
}

// src/modules/event-registrations/http/routes/index.ts
async function registrationsRoutes(app2) {
  app2.register(adminRegistrationsRoutes);
  app2.register(participantRegistrationsRoutes);
}

// src/shared/lib/multer.ts
var import_fastify_multer2 = __toESM(require("fastify-multer"));
var multer2 = (0, import_fastify_multer2.default)(upload_default.multer);

// src/modules/payments/http/controllers/create-payment-controller.ts
var import_zod20 = require("zod");

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
var import_client3 = require("@prisma/client");

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
      price: new import_client3.Prisma.Decimal(price),
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
  const paramsSchema = import_zod20.z.object({
    event_registration_id: import_zod20.z.string().uuid()
  }).strict();
  const bodySchema = import_zod20.z.object({
    payment_method: import_zod20.z.enum([
      "PIX",
      "DINHEIRO",
      "CART\xC3O DE D\xC9BITO",
      "CART\xC3O DE CR\xC9DITO"
    ]),
    price: import_zod20.z.coerce.number().positive()
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
var import_zod21 = require("zod");

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
  const paramsSchema = import_zod21.z.object({
    id: import_zod21.z.string().uuid()
  }).strict();
  const { id } = paramsSchema.parse(request.params);
  const updatePayment = makeUpdatePaymentStatusUseCase();
  const { payment } = await updatePayment.execute({ payment_id: id });
  return reply.status(200).send({ payment });
}

// src/modules/payments/http/routes/payments-routes.ts
async function paymentsRoutes(app2) {
  const participantMiddlewares = {
    onRequest: [verifyJWT, verifyUserRole("PARTICIPANT")],
    preHandler: multer2.single("file")
  };
  const adminMiddlewares = {
    onRequest: [verifyJWT, verifyUserRole("ADMINISTRATOR")]
  };
  app2.post(
    "/payments/registration/:event_registration_id",
    participantMiddlewares,
    createPaymentController
  );
  app2.patch(
    "/payments/:id/update-status",
    adminMiddlewares,
    updatePaymentStatusController
  );
}

// src/modules/participants/repositories/prisma/prisma-participants-repository.ts
var PrismaParticipantsRepository = class {
  async findById(id) {
    const participant = await prisma.participant.findUnique({
      where: { id }
    });
    return participant;
  }
  async findByUser(user_id) {
    const participant = await prisma.participant.findFirst({
      where: { user_id }
    });
    return participant;
  }
  async findManyWithUser() {
    const participants = await prisma.participant.findMany({
      include: { user: true }
    });
    return participants;
  }
  async create(data) {
    const participant = await prisma.participant.create({
      data
    });
    return participant;
  }
  async save(data) {
    const participant = await prisma.participant.update({
      where: { id: data.id },
      data
    });
    return participant;
  }
};

// src/modules/participants/use-cases/list-participants-with-user-use-case.ts
var ListParticipantsWithUserUseCase = class {
  constructor(participantsRepository) {
    this.participantsRepository = participantsRepository;
  }
  async execute() {
    const participants = await this.participantsRepository.findManyWithUser();
    return { participants };
  }
};

// src/modules/participants/use-cases/factories/make-list-participants-with-user-use-case.ts
function makeListParticipantsWithUserUseCase() {
  const participantsRepository = new PrismaParticipantsRepository();
  const useCase = new ListParticipantsWithUserUseCase(participantsRepository);
  return useCase;
}

// src/modules/participants/http/controllers/list-participants-controller.ts
async function listParticipantsController(_request, reply) {
  const listParticipants = makeListParticipantsWithUserUseCase();
  const { participants } = await listParticipants.execute();
  return reply.status(200).send({ participants });
}

// src/modules/participants/http/routes/admin-participants-routes.ts
async function adminParticipantsRoutes(app2) {
  const adminMiddlewares = {
    onRequest: [verifyJWT, verifyUserRole("ADMINISTRATOR")]
  };
  app2.get("/participants/all", adminMiddlewares, listParticipantsController);
}

// src/modules/participants/http/controllers/update-participant-controller.ts
var import_zod22 = require("zod");

// src/modules/participants/use-cases/errors/resource-not-found-error.ts
var ResourceNotFoundError5 = class extends AppError {
  constructor(resource) {
    super(`${resource ?? "Resource"} not found.`, 404);
  }
};

// src/modules/participants/use-cases/errors/participant-already-registered-error.ts
var ParticipantAlreadyRegisteredError = class extends AppError {
  constructor() {
    super("Participant data is already registered for this user", 409);
  }
};

// src/modules/participants/use-cases/errors/user-already-exists-error.ts
var UserAlreadyExistsError2 = class extends AppError {
  constructor() {
    super("E-mail already exists.", 409);
  }
};

// src/modules/participants/use-cases/update-participant-use-case.ts
var UpdateParticipantUseCase = class {
  constructor(participantsRepository) {
    this.participantsRepository = participantsRepository;
  }
  async execute({
    user_id,
    full_name,
    phone_number,
    birthdate,
    document_number,
    document_type,
    guardian_name,
    guardian_phone_number,
    prayer_group,
    community_type,
    pcd_description,
    allergy_description
  }) {
    const participant = await this.participantsRepository.findByUser(user_id);
    if (!participant)
      throw new ResourceNotFoundError5("Participant");
    if (full_name)
      participant.full_name = full_name;
    if (phone_number)
      participant.phone_number = phone_number;
    if (birthdate)
      participant.birthdate = birthdate;
    if (document_number)
      participant.document_number = document_number;
    if (document_type)
      participant.document_type = document_type;
    if (guardian_name)
      participant.guardian_name = guardian_name;
    if (guardian_phone_number)
      participant.guardian_phone_number = guardian_phone_number;
    if (prayer_group)
      participant.prayer_group = prayer_group;
    if (community_type)
      participant.community_type = community_type;
    if (pcd_description)
      participant.pcd_description = pcd_description;
    if (allergy_description)
      participant.allergy_description = allergy_description;
    await this.participantsRepository.save(participant);
    return { participant };
  }
};

// src/modules/participants/use-cases/factories/make-update-participant-use-case.ts
function makeUpdateParticipantUseCase() {
  const participantsRepository = new PrismaParticipantsRepository();
  const useCase = new UpdateParticipantUseCase(participantsRepository);
  return useCase;
}

// src/modules/participants/http/controllers/update-participant-controller.ts
async function updateParticipantController(request, reply) {
  const bodySchema = import_zod22.z.object({
    full_name: import_zod22.z.string().min(5).optional(),
    phone_number: import_zod22.z.string().optional(),
    birthdate: import_zod22.z.coerce.date().optional(),
    document_number: import_zod22.z.string().optional(),
    document_type: import_zod22.z.enum(["CPF", "RG"]).optional(),
    guardian_name: import_zod22.z.string().optional().optional(),
    guardian_phone_number: import_zod22.z.string().optional().optional(),
    prayer_group: import_zod22.z.string().optional().optional(),
    community_type: import_zod22.z.enum(["VIDA", "ALIAN\xC7A"]).optional().optional(),
    pcd_description: import_zod22.z.string().optional().optional(),
    allergy_description: import_zod22.z.string().optional().optional()
  }).strict();
  const user_id = request.user.sub;
  const {
    full_name,
    phone_number,
    birthdate,
    document_number,
    document_type,
    guardian_name,
    guardian_phone_number,
    prayer_group,
    community_type,
    pcd_description,
    allergy_description
  } = bodySchema.parse(request.body);
  const updateParticipant = makeUpdateParticipantUseCase();
  const { participant } = await updateParticipant.execute({
    user_id,
    full_name,
    phone_number,
    birthdate,
    document_number,
    document_type,
    guardian_name,
    guardian_phone_number,
    prayer_group,
    community_type,
    pcd_description,
    allergy_description
  });
  return reply.status(200).send({ participant });
}

// src/modules/participants/http/controllers/create-participant-controller.ts
var import_zod23 = require("zod");

// src/modules/participants/use-cases/create-participant-use-case.ts
var CreateParticipantUseCase = class {
  constructor(participantsRepository, usersRepository) {
    this.participantsRepository = participantsRepository;
    this.usersRepository = usersRepository;
  }
  async execute({
    user_id,
    full_name,
    phone_number,
    birthdate,
    document_number,
    document_type,
    guardian_name,
    guardian_phone_number,
    prayer_group,
    community_type,
    pcd_description,
    allergy_description
  }) {
    const userExists = await this.usersRepository.findById(user_id);
    if (!userExists)
      throw new ResourceNotFoundError5("User");
    if (userExists.role !== "PARTICIPANT")
      throw new ResourceNotFoundError5("User");
    const participantDataExists = await this.participantsRepository.findByUser(
      user_id
    );
    if (participantDataExists)
      throw new ParticipantAlreadyRegisteredError();
    const participant = await this.participantsRepository.create({
      user_id,
      full_name,
      phone_number,
      birthdate,
      document_number,
      document_type,
      guardian_name,
      guardian_phone_number,
      prayer_group,
      community_type,
      pcd_description,
      allergy_description
    });
    return { participant };
  }
};

// src/modules/participants/use-cases/factories/make-create-participant-use-case.ts
function makeCreateParticipantUseCase() {
  const participantsRepository = new PrismaParticipantsRepository();
  const usersRepository = new PrismaUsersRepository();
  const useCase = new CreateParticipantUseCase(
    participantsRepository,
    usersRepository
  );
  return useCase;
}

// src/modules/participants/http/controllers/create-participant-controller.ts
async function createParticipantController(request, reply) {
  const bodySchema = import_zod23.z.object({
    full_name: import_zod23.z.string().min(5),
    phone_number: import_zod23.z.string(),
    birthdate: import_zod23.z.coerce.date(),
    document_number: import_zod23.z.string(),
    document_type: import_zod23.z.enum(["CPF", "RG"]),
    guardian_name: import_zod23.z.string().optional(),
    guardian_phone_number: import_zod23.z.string().optional(),
    prayer_group: import_zod23.z.string().optional(),
    community_type: import_zod23.z.enum(["VIDA", "ALIAN\xC7A"]).optional(),
    pcd_description: import_zod23.z.string().optional(),
    allergy_description: import_zod23.z.string().optional()
  }).strict();
  const user_id = request.user.sub;
  const {
    full_name,
    phone_number,
    birthdate,
    document_number,
    document_type,
    guardian_name,
    guardian_phone_number,
    prayer_group,
    community_type,
    pcd_description,
    allergy_description
  } = bodySchema.parse(request.body);
  const createParticipant = makeCreateParticipantUseCase();
  const { participant } = await createParticipant.execute({
    user_id,
    full_name,
    phone_number,
    birthdate,
    document_number,
    document_type,
    guardian_name,
    guardian_phone_number,
    prayer_group,
    community_type,
    pcd_description,
    allergy_description
  });
  return reply.status(200).send({ participant });
}

// src/modules/participants/use-cases/show-participant-by-user-use-case.ts
var ShowParticipantByUserUseCase = class {
  constructor(participantsRepository) {
    this.participantsRepository = participantsRepository;
  }
  async execute({ user_id }) {
    const participant = await this.participantsRepository.findByUser(user_id);
    if (!participant)
      throw new ResourceNotFoundError5("Participante data");
    return { participant };
  }
};

// src/modules/participants/use-cases/factories/make-show-participant-by-user-use-case.ts
function makeShowParticipantByUserUseCase() {
  const participantssRepository = new PrismaParticipantsRepository();
  const useCase = new ShowParticipantByUserUseCase(participantssRepository);
  return useCase;
}

// src/modules/participants/http/controllers/show-participants-controller.ts
async function showParticipantController(request, reply) {
  const user_id = request.user.sub;
  const showParticipant = makeShowParticipantByUserUseCase();
  const { participant } = await showParticipant.execute({ user_id });
  return reply.status(200).send({ participant });
}

// src/modules/participants/http/routes/user-participants-routes.ts
async function userParticipantsRoutes(app2) {
  const participantMiddlewares = {
    onRequest: [verifyJWT, verifyUserRole("PARTICIPANT")]
  };
  app2.post(
    "/participants/me",
    participantMiddlewares,
    createParticipantController
  );
  app2.get(
    "/participants/me",
    participantMiddlewares,
    showParticipantController
  );
  app2.put(
    "/participants/me",
    participantMiddlewares,
    updateParticipantController
  );
}

// src/modules/participants/http/controllers/register-participanting-user-controller.ts
var import_zod24 = require("zod");

// src/modules/participants/use-cases/register-participanting-user-and-address-use-case.ts
var import_bcryptjs3 = require("bcryptjs");
var RegisterParticipantingUserAndAddressUseCase = class {
  constructor(participantsRepository, usersRepository, addressesRepository) {
    this.participantsRepository = participantsRepository;
    this.usersRepository = usersRepository;
    this.addressesRepository = addressesRepository;
  }
  async execute({
    name,
    email,
    password,
    street,
    street_number,
    complement,
    zip_code,
    district,
    city,
    state,
    full_name,
    phone_number,
    birthdate,
    document_number,
    document_type,
    guardian_name,
    guardian_phone_number,
    prayer_group,
    community_type,
    pcd_description,
    allergy_description
  }) {
    const password_hash = await (0, import_bcryptjs3.hash)(password, 6);
    const userWithSameEmail = await this.usersRepository.findByEmail(email);
    if (userWithSameEmail) {
      throw new UserAlreadyExistsError2();
    }
    const user = await this.usersRepository.create({
      name,
      email,
      password_hash
    });
    const address = await this.addressesRepository.create({
      street,
      street_number,
      complement,
      zip_code,
      district,
      city,
      state,
      users: {
        connect: {
          id: user.id
        }
      }
    });
    const participant = await this.participantsRepository.create({
      user_id: user.id,
      full_name,
      phone_number,
      birthdate,
      document_number,
      document_type,
      guardian_name,
      guardian_phone_number,
      prayer_group,
      community_type,
      pcd_description,
      allergy_description
    });
    return { participant };
  }
};

// src/modules/participants/use-cases/factories/make-register-participant-user-and-address-use-case.ts
function makeRegisterParticipantUserAndAddressUseCase() {
  const participantsRepository = new PrismaParticipantsRepository();
  const usersRepository = new PrismaUsersRepository();
  const addressesRepository = new PrismaAddressesRepository();
  const useCase = new RegisterParticipantingUserAndAddressUseCase(
    participantsRepository,
    usersRepository,
    addressesRepository
  );
  return useCase;
}

// src/modules/participants/http/controllers/register-participanting-user-controller.ts
async function registerParticipantingUserController(request, reply) {
  const bodySchema = import_zod24.z.object({
    name: import_zod24.z.string(),
    email: import_zod24.z.string().email(),
    password: import_zod24.z.string().min(8),
    password_confirmation: import_zod24.z.string().min(8),
    street: import_zod24.z.string(),
    street_number: import_zod24.z.string(),
    complement: import_zod24.z.string().optional(),
    zip_code: import_zod24.z.string(),
    district: import_zod24.z.string(),
    city: import_zod24.z.string(),
    state: import_zod24.z.string(),
    full_name: import_zod24.z.string().min(5),
    phone_number: import_zod24.z.string(),
    birthdate: import_zod24.z.coerce.date(),
    document_number: import_zod24.z.string(),
    document_type: import_zod24.z.enum(["CPF", "RG"]),
    guardian_name: import_zod24.z.string().optional().optional(),
    guardian_phone_number: import_zod24.z.string().optional().optional(),
    prayer_group: import_zod24.z.string().optional().optional(),
    community_type: import_zod24.z.enum(["VIDA", "ALIAN\xC7A"]).optional().optional(),
    pcd_description: import_zod24.z.string().optional().optional(),
    allergy_description: import_zod24.z.string().optional().optional()
  }).strict().refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ["password_confirmation"]
  });
  const {
    name,
    email,
    password,
    street,
    street_number,
    complement,
    zip_code,
    district,
    city,
    state,
    full_name,
    phone_number,
    birthdate,
    document_number,
    document_type,
    guardian_name,
    guardian_phone_number,
    prayer_group,
    community_type,
    pcd_description,
    allergy_description
  } = bodySchema.parse(request.body);
  const registerParticipantingUser = makeRegisterParticipantUserAndAddressUseCase();
  const { participant } = await registerParticipantingUser.execute({
    name,
    email,
    password,
    street,
    street_number,
    complement,
    zip_code,
    district,
    city,
    state,
    full_name,
    phone_number,
    birthdate,
    document_number,
    document_type,
    guardian_name,
    guardian_phone_number,
    prayer_group,
    community_type,
    pcd_description,
    allergy_description
  });
  return reply.status(200).send({ participant });
}

// src/modules/participants/http/routes/publics-participants-routes.ts
async function publicsParticipantsRoutes(app2) {
  app2.post("/participants/register", registerParticipantingUserController);
}

// src/modules/participants/http/routes/index.ts
async function participantsRoutes(app2) {
  app2.register(publicsParticipantsRoutes);
  app2.register(adminParticipantsRoutes);
  app2.register(userParticipantsRoutes);
}

// src/shared/infra/http/routes.ts
async function appRoutes(app2) {
  app2.register(userRoutes);
  app2.register(sessionsRoutes);
  app2.register(profileRoutes);
  app2.register(eventsRoutes);
  app2.register(tokenRoutes);
  app2.register(addressesRoutes);
  app2.register(ticketsRoutes);
  app2.register(registrationsRoutes);
  app2.register(paymentsRoutes);
  app2.register(participantsRoutes);
}

// src/shared/errors/error-handler.ts
var import_zod25 = require("zod");
function errorHandler(error, _, reply) {
  if (error instanceof import_zod25.ZodError) {
    return reply.status(400).send({
      message: "Validation error.",
      issues: error.format()
    });
  }
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      error: "error",
      message: error.message
    });
  }
  if (env.NODE_ENV !== "production") {
    console.error(error);
  } else {
  }
  return reply.status(500).send({ message: "Internal Server Error" });
}

// src/shared/infra/app.ts
var app = (0, import_fastify.default)();
app.register(import_jwt.default, auth_default.jwt);
app.register(import_cookie.default);
app.register(import_fastify_multer3.default.contentParser);
app.register(import_cors.default, {
  // Permitir origens específicas (ou use "*" para permitir qualquer origem)
  origin: "*",
  // Permitir métodos HTTP específicos
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  // Permitir cabeçalhos HTTP personalizados
  allowedHeaders: ["Authorization", "Content-Type"],
  // Permitir o envio de credenciais (cookies)
  credentials: true
});
app.register(import_static.default, {
  root: upload_default.tmpFolder,
  prefix: "/files/"
});
app.register(appRoutes);
app.setErrorHandler(errorHandler);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  app
});
