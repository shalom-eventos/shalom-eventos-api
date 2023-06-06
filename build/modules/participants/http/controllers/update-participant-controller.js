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

// src/modules/participants/http/controllers/update-participant-controller.ts
var update_participant_controller_exports = {};
__export(update_participant_controller_exports, {
  updateParticipantController: () => updateParticipantController
});
module.exports = __toCommonJS(update_participant_controller_exports);
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
      include: { user: { include: { addresses: true } } }
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
    const { id, created_at, updated_at, ...dataUpdated } = data;
    const participant = await prisma.participant.update({
      where: { id: data.id },
      data: dataUpdated
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
    allergy_description,
    medication_use_description
  }) {
    const participant = await this.participantsRepository.findByUser(user_id);
    if (!participant)
      throw new ResourceNotFoundError("Participant");
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
    if (medication_use_description)
      participant.medication_use_description = medication_use_description;
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
  const bodySchema = import_zod2.z.object({
    full_name: import_zod2.z.string().min(5).optional(),
    phone_number: import_zod2.z.string().optional(),
    birthdate: import_zod2.z.coerce.date().optional(),
    document_number: import_zod2.z.string().optional(),
    document_type: import_zod2.z.enum(["CPF", "RG"]).optional(),
    guardian_name: import_zod2.z.string().optional().optional(),
    guardian_phone_number: import_zod2.z.string().optional().optional(),
    prayer_group: import_zod2.z.string().optional().optional(),
    community_type: import_zod2.z.enum(["VIDA", "ALIAN\xC7A"]).optional().optional(),
    pcd_description: import_zod2.z.string().optional().optional(),
    allergy_description: import_zod2.z.string().optional().optional(),
    medication_use_description: import_zod2.z.string().optional().optional()
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
    allergy_description,
    medication_use_description
  });
  return reply.status(200).send({ participant });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  updateParticipantController
});
