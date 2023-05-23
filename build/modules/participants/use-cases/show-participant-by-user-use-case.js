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

// src/modules/participants/use-cases/show-participant-by-user-use-case.ts
var show_participant_by_user_use_case_exports = {};
__export(show_participant_by_user_use_case_exports, {
  ShowParticipantByUserUseCase: () => ShowParticipantByUserUseCase
});
module.exports = __toCommonJS(show_participant_by_user_use_case_exports);

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

// src/modules/participants/use-cases/show-participant-by-user-use-case.ts
var ShowParticipantByUserUseCase = class {
  constructor(participantsRepository) {
    this.participantsRepository = participantsRepository;
  }
  async execute({ user_id }) {
    const participant = await this.participantsRepository.findByUser(user_id);
    if (!participant)
      throw new ResourceNotFoundError("Participante data");
    return { participant };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ShowParticipantByUserUseCase
});
