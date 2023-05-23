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

// src/modules/addresses/http/routes/participant-addresses-routes.ts
var participant_addresses_routes_exports = {};
__export(participant_addresses_routes_exports, {
  participantAddressesRoutes: () => participantAddressesRoutes
});
module.exports = __toCommonJS(participant_addresses_routes_exports);

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

// src/modules/addresses/http/controllers/update-address-to-participant-controller.ts
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

// src/modules/addresses/use-cases/errors/user-is-not-participant-error.ts
var UserIsNotParticipantError = class extends AppError {
  constructor() {
    super("User is not participant.", 403);
  }
};

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
      throw new ResourceNotFoundError("User");
    if (userParticipant.role !== "PARTICIPANT")
      throw new UserIsNotParticipantError();
    if (userParticipant?.addresses && userParticipant.addresses.length === 0)
      throw new ResourceNotFoundError("Address");
    const address = userParticipant.addresses.find(
      (address2) => address2.id === address_id
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
var import_zod3 = require("zod");

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
      throw new ResourceNotFoundError("User");
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
  const bodySchema = import_zod3.z.object({
    street: import_zod3.z.string(),
    street_number: import_zod3.z.string(),
    complement: import_zod3.z.string().optional(),
    zip_code: import_zod3.z.string(),
    district: import_zod3.z.string(),
    city: import_zod3.z.string(),
    state: import_zod3.z.string()
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
async function participantAddressesRoutes(app) {
  const participantMiddlewares = {
    onRequest: [verifyJWT, verifyUserRole("PARTICIPANT")]
  };
  app.post(
    "/addresses/participant",
    participantMiddlewares,
    createAddressToParticipantController
  );
  app.put(
    "/addresses/:id/participant",
    participantMiddlewares,
    updateAddressToParticipantController
  );
  app.get(
    "/addresses/participant",
    participantMiddlewares,
    listAddressesByParticipantController
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  participantAddressesRoutes
});
