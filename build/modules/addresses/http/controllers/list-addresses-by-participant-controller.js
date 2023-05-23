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

// src/modules/addresses/http/controllers/list-addresses-by-participant-controller.ts
var list_addresses_by_participant_controller_exports = {};
__export(list_addresses_by_participant_controller_exports, {
  listAddressesByParticipantController: () => listAddressesByParticipantController
});
module.exports = __toCommonJS(list_addresses_by_participant_controller_exports);

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  listAddressesByParticipantController
});
