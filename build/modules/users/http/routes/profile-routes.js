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

// src/modules/users/http/routes/profile-routes.ts
var profile_routes_exports = {};
__export(profile_routes_exports, {
  profileRoutes: () => profileRoutes
});
module.exports = __toCommonJS(profile_routes_exports);

// src/shared/infra/http/middlewares/verify-jwt.ts
async function verifyJWT(request, reply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    return reply.status(401).send({ message: "Unauthorized." });
  }
}

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

// src/modules/users/repositories/prisma/prisma-users-repository.ts
var PrismaUsersRepository = class {
  async findById(id) {
    const user = await prisma.user.findUnique({
      where: { id }
    });
    return user;
  }
  async findByEmail(email) {
    const user = await prisma.user.findUnique({
      where: { email }
    });
    return user;
  }
  async create(data) {
    const user = await prisma.user.create({
      data
    });
    return user;
  }
};

// src/shared/errors/app-error.ts
var AppError = class {
  constructor(message, statusCode = 400) {
    this.message = message;
    this.statusCode = statusCode;
  }
};

// src/modules/users/use-cases/errors/resource-not-found-error.ts
var ResourceNotFoundError = class extends AppError {
  constructor() {
    super("Resource not found.", 404);
  }
};

// src/modules/users/use-cases/get-user-profile.ts
var GetUserProfileUseCase = class {
  constructor(usersRepository) {
    this.usersRepository = usersRepository;
  }
  async execute({
    userId
  }) {
    const user = await this.usersRepository.findById(userId);
    if (!user)
      throw new ResourceNotFoundError();
    return { user };
  }
};

// src/modules/users/use-cases/factories/make-get-user-profile-use-case.ts
function makeGetUserProfileUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const useCase = new GetUserProfileUseCase(usersRepository);
  return useCase;
}

// src/shared/utils/exclude-fields.ts
function excludeFields(model, keys) {
  for (let key of keys) {
    delete model[key];
  }
  return model;
}

// src/modules/users/http/controllers/profile.ts
async function profile(request, reply) {
  const userId = request?.user?.sub;
  const getUserProfile = makeGetUserProfileUseCase();
  const { user } = await getUserProfile.execute({ userId });
  return reply.status(200).send({ user: excludeFields(user, ["password_hash"]) });
}

// src/modules/users/http/routes/profile-routes.ts
async function profileRoutes(app) {
  app.get("/profile", { onRequest: [verifyJWT] }, profile);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  profileRoutes
});
