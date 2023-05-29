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

// src/modules/participants/http/controllers/create-participant-controller.ts
var create_participant_controller_exports = {};
__export(create_participant_controller_exports, {
  createParticipantController: () => createParticipantController
});
module.exports = __toCommonJS(create_participant_controller_exports);
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

// src/shared/errors/app-error.ts
var AppError = class {
  constructor(message, statusCode = 400) {
    this.message = message;
    this.statusCode = statusCode;
  }
};

// src/modules/participants/use-cases/errors/resource-not-found-error.ts
var ResourceNotFoundError = class extends AppError {
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
    allergy_description,
    medication_use_description
  }) {
    const userExists = await this.usersRepository.findById(user_id);
    if (!userExists)
      throw new ResourceNotFoundError("User");
    if (userExists.role !== "PARTICIPANT")
      throw new ResourceNotFoundError("User");
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
      allergy_description,
      medication_use_description
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
  const bodySchema = import_zod2.z.object({
    full_name: import_zod2.z.string().min(5),
    phone_number: import_zod2.z.string(),
    birthdate: import_zod2.z.coerce.date(),
    document_number: import_zod2.z.string(),
    document_type: import_zod2.z.enum(["CPF", "RG"]),
    guardian_name: import_zod2.z.string().optional(),
    guardian_phone_number: import_zod2.z.string().optional(),
    prayer_group: import_zod2.z.string().optional(),
    community_type: import_zod2.z.enum(["VIDA", "ALIAN\xC7A"]).optional(),
    pcd_description: import_zod2.z.string().optional(),
    allergy_description: import_zod2.z.string().optional(),
    medication_use_description: import_zod2.z.string().optional()
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
    allergy_description,
    medication_use_description
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
    allergy_description,
    medication_use_description
  });
  return reply.status(200).send({ participant });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createParticipantController
});