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

// src/modules/addresses/use-cases/errors/user-is-not-participant-error.ts
var user_is_not_participant_error_exports = {};
__export(user_is_not_participant_error_exports, {
  UserIsNotParticipantError: () => UserIsNotParticipantError
});
module.exports = __toCommonJS(user_is_not_participant_error_exports);

// src/shared/errors/app-error.ts
var AppError = class {
  constructor(message, statusCode = 400) {
    this.message = message;
    this.statusCode = statusCode;
  }
};

// src/modules/addresses/use-cases/errors/user-is-not-participant-error.ts
var UserIsNotParticipantError = class extends AppError {
  constructor() {
    super("User is not participant.", 403);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  UserIsNotParticipantError
});
