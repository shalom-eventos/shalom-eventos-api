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

// src/modules/addresses/use-cases/factories/make-update-address-to-participant-use-case.ts
var make_update_address_to_participant_use_case_exports = {};
__export(make_update_address_to_participant_use_case_exports, {
  makeUpdateAddressToParticipantUseCase: () => makeUpdateAddressToParticipantUseCase
});
module.exports = __toCommonJS(make_update_address_to_participant_use_case_exports);

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  makeUpdateAddressToParticipantUseCase
});