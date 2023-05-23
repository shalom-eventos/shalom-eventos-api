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

// src/modules/participants/use-cases/list-participants-with-user-use-case.ts
var list_participants_with_user_use_case_exports = {};
__export(list_participants_with_user_use_case_exports, {
  ListParticipantsWithUserUseCase: () => ListParticipantsWithUserUseCase
});
module.exports = __toCommonJS(list_participants_with_user_use_case_exports);
var ListParticipantsWithUserUseCase = class {
  constructor(participantsRepository) {
    this.participantsRepository = participantsRepository;
  }
  async execute() {
    const participants = await this.participantsRepository.findManyWithUser();
    return { participants };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ListParticipantsWithUserUseCase
});
