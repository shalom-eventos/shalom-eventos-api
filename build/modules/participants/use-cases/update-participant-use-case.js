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

// src/modules/participants/use-cases/update-participant-use-case.ts
var update_participant_use_case_exports = {};
__export(update_participant_use_case_exports, {
  UpdateParticipantUseCase: () => UpdateParticipantUseCase
});
module.exports = __toCommonJS(update_participant_use_case_exports);

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  UpdateParticipantUseCase
});
