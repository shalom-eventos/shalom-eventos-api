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

// src/modules/participants/http/routes/publics-participants-routes.ts
var publics_participants_routes_exports = {};
__export(publics_participants_routes_exports, {
  publicsParticipantsRoutes: () => publicsParticipantsRoutes
});
module.exports = __toCommonJS(publics_participants_routes_exports);

// src/modules/participants/http/controllers/register-participanting-user-controller.ts
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

// src/modules/participants/use-cases/register-participanting-user-and-address-use-case.ts
var import_bcryptjs = require("bcryptjs");

// src/shared/errors/app-error.ts
var AppError = class {
  constructor(message, statusCode = 400) {
    this.message = message;
    this.statusCode = statusCode;
  }
};

// src/modules/participants/use-cases/errors/user-already-exists-error.ts
var UserAlreadyExistsError = class extends AppError {
  constructor() {
    super("E-mail already exists.", 409);
  }
};

// src/modules/participants/use-cases/register-participanting-user-and-address-use-case.ts
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
    allergy_description,
    medication_use_description
  }) {
    const password_hash = await (0, import_bcryptjs.hash)(password, 6);
    const userWithSameEmail = await this.usersRepository.findByEmail(email);
    if (userWithSameEmail) {
      throw new UserAlreadyExistsError();
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
      allergy_description,
      medication_use_description
    });
    return { participant };
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
  const bodySchema = import_zod2.z.object({
    name: import_zod2.z.string(),
    email: import_zod2.z.string().email(),
    password: import_zod2.z.string().min(8),
    password_confirmation: import_zod2.z.string().min(8),
    street: import_zod2.z.string(),
    street_number: import_zod2.z.string(),
    complement: import_zod2.z.string().optional(),
    zip_code: import_zod2.z.string(),
    district: import_zod2.z.string(),
    city: import_zod2.z.string(),
    state: import_zod2.z.string(),
    full_name: import_zod2.z.string().min(5),
    phone_number: import_zod2.z.string(),
    birthdate: import_zod2.z.coerce.date(),
    document_number: import_zod2.z.string(),
    document_type: import_zod2.z.enum(["CPF", "RG"]),
    guardian_name: import_zod2.z.string().optional().optional(),
    guardian_phone_number: import_zod2.z.string().optional().optional(),
    prayer_group: import_zod2.z.string().optional().optional(),
    community_type: import_zod2.z.enum(["VIDA", "ALIAN\xC7A"]).optional().optional(),
    pcd_description: import_zod2.z.string().optional().optional(),
    allergy_description: import_zod2.z.string().optional().optional(),
    medication_use_description: import_zod2.z.string().optional().optional()
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
    allergy_description,
    medication_use_description
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
    allergy_description,
    medication_use_description
  });
  return reply.status(200).send({ participant });
}

// src/modules/participants/http/routes/publics-participants-routes.ts
async function publicsParticipantsRoutes(app) {
  app.post("/participants/register", registerParticipantingUserController);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  publicsParticipantsRoutes
});
