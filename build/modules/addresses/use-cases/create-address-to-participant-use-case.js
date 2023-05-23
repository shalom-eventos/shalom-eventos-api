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

// src/modules/addresses/use-cases/create-address-to-participant-use-case.ts
var create_address_to_participant_use_case_exports = {};
__export(create_address_to_participant_use_case_exports, {
  CreateAddressToParticipantUseCase: () => CreateAddressToParticipantUseCase
});
module.exports = __toCommonJS(create_address_to_participant_use_case_exports);

// src/shared/errors/app-error.ts
var AppError = class {
  constructor(message, statusCode = 400) {
    this.message = message;
    this.statusCode = statusCode;
  }
};

// src/modules/addresses/use-cases/errors/already-has-address-error.ts
var AlreadyHasAddressError = class extends AppError {
  constructor() {
    super("Resource already has a registered address", 409);
  }
};

// src/modules/addresses/use-cases/errors/resource-not-found-error.ts
var ResourceNotFoundError = class extends AppError {
  constructor(resource) {
    super(`${resource ?? "Resource"} not found.`, 404);
  }
};

// src/modules/addresses/use-cases/errors/user-is-not-participant-error.ts
var UserIsNotParticipantError = class extends AppError {
  constructor() {
    super("User is not participant.", 403);
  }
};

// src/modules/addresses/use-cases/create-address-to-participant-use-case.ts
var CreateAddressToParticipantUseCase = class {
  constructor(addressesRepository, usersRepository) {
    this.addressesRepository = addressesRepository;
    this.usersRepository = usersRepository;
  }
  async execute({
    user_id,
    street,
    street_number,
    complement,
    zip_code,
    district,
    city,
    state
  }) {
    const userParticipant = await this.usersRepository.findByIdWithRelations(
      user_id
    );
    if (!userParticipant)
      throw new ResourceNotFoundError("User");
    if (userParticipant.role !== "PARTICIPANT")
      throw new UserIsNotParticipantError();
    if (userParticipant?.addresses && userParticipant.addresses.length > 0)
      throw new AlreadyHasAddressError();
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
          id: userParticipant.id
        }
      }
    });
    return { address };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CreateAddressToParticipantUseCase
});
