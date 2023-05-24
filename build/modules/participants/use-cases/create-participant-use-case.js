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

// src/modules/participants/use-cases/create-participant-use-case.ts
var create_participant_use_case_exports = {};
__export(create_participant_use_case_exports, {
  CreateParticipantUseCase: () => CreateParticipantUseCase
});
module.exports = __toCommonJS(create_participant_use_case_exports);

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CreateParticipantUseCase
});
