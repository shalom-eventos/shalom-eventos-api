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

// src/modules/addresses/use-cases/factories/make-update-address-use-case.ts
var make_update_address_use_case_exports = {};
__export(make_update_address_use_case_exports, {
  makeUpdateAddressUseCase: () => makeUpdateAddressUseCase
});
module.exports = __toCommonJS(make_update_address_use_case_exports);

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

// src/modules/addresses/repositories/prisma/prisma-addresses-repository.ts
var PrismaAddressesRepository = class {
  async findById(id) {
    const address = await prisma.address.findUnique({
      where: { id }
    });
    return address;
  }
  async create(data) {
    const address = await prisma.address.create({
      data
    });
    return address;
  }
  async save(data) {
    const address = await prisma.address.update({
      where: { id: data.id },
      data
    });
    return address;
  }
};

// src/shared/errors/app-error.ts
var AppError = class {
  constructor(message, statusCode = 400) {
    this.message = message;
    this.statusCode = statusCode;
  }
};

// src/modules/addresses/use-cases/errors/resource-not-found-error.ts
var ResourceNotFoundError = class extends AppError {
  constructor() {
    super("Resource not found.", 404);
  }
};

// src/modules/addresses/use-cases/update-address-use-case.ts
var UpdateAddressUseCase = class {
  constructor(addressesRepository) {
    this.addressesRepository = addressesRepository;
  }
  async execute(id, {
    street,
    street_number,
    complement,
    zip_code,
    district,
    city,
    state
  }) {
    const address = await this.addressesRepository.findById(id);
    if (!address)
      throw new ResourceNotFoundError();
    if (street)
      address.street = street;
    if (street_number)
      address.street_number = street_number;
    if (complement)
      address.complement = complement;
    if (zip_code)
      address.zip_code = zip_code;
    if (district)
      address.district = district;
    if (city)
      address.city = city;
    if (state)
      address.state = state;
    await this.addressesRepository.save(address);
    return { address };
  }
};

// src/modules/addresses/use-cases/factories/make-update-address-use-case.ts
function makeUpdateAddressUseCase() {
  const addressesRepository = new PrismaAddressesRepository();
  const useCase = new UpdateAddressUseCase(addressesRepository);
  return useCase;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  makeUpdateAddressUseCase
});
