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

// src/modules/event-registrations/use-cases/create-registration-use-case.ts
var create_registration_use_case_exports = {};
__export(create_registration_use_case_exports, {
  CreateEventRegistrationUseCase: () => CreateEventRegistrationUseCase
});
module.exports = __toCommonJS(create_registration_use_case_exports);

// src/shared/errors/app-error.ts
var AppError = class {
  constructor(message, statusCode = 400) {
    this.message = message;
    this.statusCode = statusCode;
  }
};

// src/modules/event-registrations/use-cases/errors/resource-not-found-error.ts
var ResourceNotFoundError = class extends AppError {
  constructor() {
    super("Resource not found.", 404);
  }
};

// src/modules/event-registrations/use-cases/create-registration-use-case.ts
var CreateEventRegistrationUseCase = class {
  constructor(registrationsRepository, eventsRepository, usersRepository) {
    this.registrationsRepository = registrationsRepository;
    this.eventsRepository = eventsRepository;
    this.usersRepository = usersRepository;
  }
  async execute({
    user_id,
    event_id,
    full_name,
    phone_number,
    age,
    document_number,
    document_type,
    guardian_name,
    guardian_phone_number,
    prayer_group,
    event_source,
    community_type,
    pcd_description,
    allergy_description,
    transportation_mode,
    accepted_the_terms
  }) {
    const eventExists = await this.eventsRepository.findById(event_id);
    if (!eventExists)
      throw new ResourceNotFoundError();
    const userExists = await this.usersRepository.findById(user_id);
    if (!userExists)
      throw new ResourceNotFoundError();
    const registration = await this.registrationsRepository.create({
      user_id,
      event_id,
      full_name,
      phone_number,
      age,
      document_number,
      document_type,
      guardian_name,
      guardian_phone_number,
      prayer_group,
      event_source,
      community_type,
      pcd_description,
      allergy_description,
      transportation_mode,
      accepted_the_terms
    });
    return { registration };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CreateEventRegistrationUseCase
});
