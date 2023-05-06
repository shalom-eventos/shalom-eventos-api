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

// src/modules/addresses/http/routes/address-routes.ts
var address_routes_exports = {};
__export(address_routes_exports, {
  addressRoutes: () => addressRoutes
});
module.exports = __toCommonJS(address_routes_exports);

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

// src/modules/addresses/http/controllers/update-address-controller.ts
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

// src/shared/errors/app-error.ts
var AppError = class {
  constructor(message, statusCode = 400) {
    this.message = message;
    this.statusCode = statusCode;
  }
};

// src/modules/addresses/use-cases/errors/resource-not-found-error.ts
var ResourceNotFoundError = class extends AppError {
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
      throw new ResourceNotFoundError();
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
  const paramsSchema = import_zod2.z.object({
    id: import_zod2.z.string().uuid()
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
var import_zod3 = require("zod");

// src/modules/events/repositories/prisma/prisma-events-repository.ts
var PrismaEventsRepository = class {
  async findById(id) {
    const event = await prisma.event.findUnique({
      where: { id }
    });
    return event;
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
      throw new ResourceNotFoundError();
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
      throw new ResourceNotFoundError();
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

// src/modules/addresses/http/routes/address-routes.ts
async function addressRoutes(app) {
  app.addHook("onRequest", verifyJWT);
  app.addHook("onRequest", verifyUserRole("ADMINISTRATOR"));
  app.post("/addresses/event/:event_id", createAddressToEventController);
  app.get("/addresses/:id", getAddressController);
  app.put("/addresses/:id", updateAddressController);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  addressRoutes
});
