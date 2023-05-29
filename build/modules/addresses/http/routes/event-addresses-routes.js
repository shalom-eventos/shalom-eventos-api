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

// src/modules/addresses/http/routes/event-addresses-routes.ts
var event_addresses_routes_exports = {};
__export(event_addresses_routes_exports, {
  eventAddressesRoutes: () => eventAddressesRoutes
});
module.exports = __toCommonJS(event_addresses_routes_exports);

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

// src/modules/addresses/http/controllers/update-address-to-event-controller.ts
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
    const { id, created_at, updated_at, ...dataUpdated } = data;
    const address = await prisma.address.update({
      where: { id: data.id },
      data: dataUpdated
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

// src/shared/errors/app-error.ts
var AppError = class {
  constructor(message, statusCode = 400) {
    this.message = message;
    this.statusCode = statusCode;
  }
};

// src/modules/addresses/use-cases/errors/already-has-address-error.ts
var AlreadyHasAddressError = class extends AppError {
  constructor() {
    super("Resource already has a registered address", 409);
  }
};

// src/modules/addresses/use-cases/errors/resource-not-found-error.ts
var ResourceNotFoundError = class extends AppError {
  constructor(resource) {
    super(`${resource ?? "Resource"} not found.`, 404);
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
      throw new ResourceNotFoundError("Address");
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
  const paramsSchema = import_zod2.z.object({
    address_id: import_zod2.z.string().uuid(),
    event_id: import_zod2.z.string().uuid()
  }).strict();
  const bodySchema = import_zod2.z.object({
    street: import_zod2.z.string().optional(),
    street_number: import_zod2.z.string().optional(),
    complement: import_zod2.z.string().optional(),
    zip_code: import_zod2.z.string().optional(),
    district: import_zod2.z.string().optional(),
    city: import_zod2.z.string().optional(),
    state: import_zod2.z.string().optional()
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
var import_zod3 = require("zod");

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
      throw new ResourceNotFoundError("User");
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
  const paramsSchema = import_zod3.z.object({
    event_id: import_zod3.z.string().uuid()
  }).strict();
  const bodySchema = import_zod3.z.object({
    street: import_zod3.z.string(),
    street_number: import_zod3.z.string(),
    complement: import_zod3.z.string().optional(),
    zip_code: import_zod3.z.string(),
    district: import_zod3.z.string(),
    city: import_zod3.z.string(),
    state: import_zod3.z.string()
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
var import_zod4 = require("zod");

// src/modules/addresses/use-cases/get-address-use-case.ts
var GetAddressUseCase = class {
  constructor(addressesRepository) {
    this.addressesRepository = addressesRepository;
  }
  async execute({ id }) {
    const address = await this.addressesRepository.findById(id);
    if (!address)
      throw new ResourceNotFoundError("Event");
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
  const paramsSchema = import_zod4.z.object({
    id: import_zod4.z.string().uuid()
  }).strict();
  const { id } = paramsSchema.parse(request.params);
  const getAddress = makeGetAddressEventUseCase();
  const { address } = await getAddress.execute({ id });
  return reply.status(200).send({ address });
}

// src/modules/addresses/http/controllers/list-addresses-by-event-controller.ts
var import_zod5 = require("zod");

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
  const paramsSchema = import_zod5.z.object({
    event_id: import_zod5.z.string().uuid()
  }).strict();
  const { event_id } = paramsSchema.parse(request.params);
  const listAddresses = makeListAddressesByEventUseCase();
  const { addresses } = await listAddresses.execute({ event_id });
  return reply.status(200).send({ addresses });
}

// src/modules/addresses/http/routes/event-addresses-routes.ts
async function eventAddressesRoutes(app) {
  app.get("/addresses/:id", getAddressController);
  const adminMiddlewares = {
    onRequest: [verifyJWT, verifyUserRole("ADMINISTRATOR")]
  };
  app.post(
    "/addresses/event/:event_id",
    adminMiddlewares,
    createAddressToEventController
  );
  app.put(
    "/addresses/:address_id/event/:event_id",
    adminMiddlewares,
    updateAddressToEventController
  );
  app.get(
    "/addresses/event/:event_id",
    adminMiddlewares,
    listAddressesByEventController
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  eventAddressesRoutes
});
