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

// src/modules/event-tickets/use-cases/errors/expires-in-cannot-be-after-event-end-date-error.ts
var expires_in_cannot_be_after_event_end_date_error_exports = {};
__export(expires_in_cannot_be_after_event_end_date_error_exports, {
  ExpiresInCannotBeAfterEventEndDateError: () => ExpiresInCannotBeAfterEventEndDateError
});
module.exports = __toCommonJS(expires_in_cannot_be_after_event_end_date_error_exports);

// src/shared/errors/app-error.ts
var AppError = class {
  constructor(message, statusCode = 400) {
    this.message = message;
    this.statusCode = statusCode;
  }
};

// src/modules/event-tickets/use-cases/errors/expires-in-cannot-be-after-event-end-date-error.ts
var ExpiresInCannotBeAfterEventEndDateError = class extends AppError {
  constructor() {
    super("Expires In cannot be after event end date.", 403);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ExpiresInCannotBeAfterEventEndDateError
});
