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

// src/modules/participants/use-cases/register-participanting-user-and-address-use-case.ts
var register_participanting_user_and_address_use_case_exports = {};
__export(register_participanting_user_and_address_use_case_exports, {
  RegisterParticipantingUserAndAddressUseCase: () => RegisterParticipantingUserAndAddressUseCase
});
module.exports = __toCommonJS(register_participanting_user_and_address_use_case_exports);
var import_bcryptjs = require("bcryptjs");

// src/shared/errors/app-error.ts
var AppError = class {
  constructor(message, statusCode = 400) {
    this.message = message;
    this.statusCode = statusCode;
  }
};

// src/modules/participants/use-cases/errors/user-already-exists-error.ts
var UserAlreadyExistsError = class extends AppError {
  constructor() {
    super("E-mail already exists.", 409);
  }
};

// src/modules/participants/use-cases/register-participanting-user-and-address-use-case.ts
var RegisterParticipantingUserAndAddressUseCase = class {
  constructor(participantsRepository, usersRepository, addressesRepository) {
    this.participantsRepository = participantsRepository;
    this.usersRepository = usersRepository;
    this.addressesRepository = addressesRepository;
  }
  async execute({
    name,
    email,
    password,
    street,
    street_number,
    complement,
    zip_code,
    district,
    city,
    state,
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
    const password_hash = await (0, import_bcryptjs.hash)(password, 6);
    const userWithSameEmail = await this.usersRepository.findByEmail(email);
    if (userWithSameEmail) {
      throw new UserAlreadyExistsError();
    }
    const user = await this.usersRepository.create({
      name,
      email,
      password_hash
    });
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
          id: user.id
        }
      }
    });
    const participant = await this.participantsRepository.create({
      user_id: user.id,
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
  RegisterParticipantingUserAndAddressUseCase
});
