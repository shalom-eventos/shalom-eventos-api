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

// src/modules/addresses/use-cases/factories/make-create-address-to-event-use-case.ts
var make_create_address_to_event_use_case_exports = {};
__export(make_create_address_to_event_use_case_exports, {
  makeCreateAddressToEventUseCase: () => makeCreateAddressToEventUseCase
});
module.exports = __toCommonJS(make_create_address_to_event_use_case_exports);

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

// src/modules/addresses/use-cases/errors/already-has-address-error.ts
var AlreadyHasAddressError = class extends AppError {
  constructor() {
    super("Resource already has a registered address", 409);
  }
};

// src/modules/addresses/use-cases/errors/resource-not-found-error.ts
var ResourceNotFoundError = class extends AppError {
  constructor() {
    super("Resource not found.", 404);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  makeCreateAddressToEventUseCase
});
