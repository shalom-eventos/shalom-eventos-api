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

// src/modules/event-registrations/http/controllers/list-registrations-by-user-controller.ts
var list_registrations_by_user_controller_exports = {};
__export(list_registrations_by_user_controller_exports, {
  listRegistrationsByUserController: () => listRegistrationsByUserController
});
module.exports = __toCommonJS(list_registrations_by_user_controller_exports);

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  listRegistrationsByUserController
});