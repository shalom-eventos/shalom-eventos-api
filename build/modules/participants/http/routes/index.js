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

// src/modules/participants/http/routes/index.ts
var routes_exports = {};
__export(routes_exports, {
  participantsRoutes: () => participantsRoutes
});
module.exports = __toCommonJS(routes_exports);

// src/shared/infra/http/middlewares/verify-user-role.ts
function verifyUserRole(roleToVerify) {
  return async (request, reply) => {
    const { role } = request.user;
    if (role !== roleToVerify) {
      return reply.status(401).send({ message: "Unauthorized." });
    }
  };
}

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

// src/modules/participants/repositories/prisma/prisma-participants-repository.ts
var PrismaParticipantsRepository = class {
  async findById(id) {
    const participant = await prisma.participant.findUnique({
      where: { id }
    });
    return participant;
  }
  async findByUser(user_id) {
    const participant = await prisma.participant.findFirst({
      where: { user_id }
    });
    return participant;
  }
  async findManyWithUser() {
    const participants = await prisma.participant.findMany({
      include: { user: true }
    });
    return participants;
  }
  async create(data) {
    const participant = await prisma.participant.create({
      data
    });
    return participant;
  }
  async save(data) {
    const participant = await prisma.participant.update({
      where: { id: data.id },
      data
    });
    return participant;
  }
};

// src/modules/participants/use-cases/list-participants-with-user-use-case.ts
var ListParticipantsWithUserUseCase = class {
  constructor(participantsRepository) {
    this.participantsRepository = participantsRepository;
  }
  async execute() {
    const participants = await this.participantsRepository.findManyWithUser();
    return { participants };
  }
};

// src/modules/participants/use-cases/factories/make-list-participants-with-user-use-case.ts
function makeListParticipantsWithUserUseCase() {
  const participantsRepository = new PrismaParticipantsRepository();
  const useCase = new ListParticipantsWithUserUseCase(participantsRepository);
  return useCase;
}

// src/modules/participants/http/controllers/list-participants-controller.ts
async function listParticipantsController(_request, reply) {
  const listParticipants = makeListParticipantsWithUserUseCase();
  const { participants } = await listParticipants.execute();
  return reply.status(200).send({ participants });
}

// src/modules/participants/http/routes/admin-participants-routes.ts
async function adminParticipantsRoutes(app) {
  const adminMiddlewares = {
    onRequest: [verifyJWT, verifyUserRole("ADMINISTRATOR")]
  };
  app.get("/participants/all", adminMiddlewares, listParticipantsController);
}

// src/modules/participants/http/controllers/update-participant-controller.ts
var import_zod2 = require("zod");

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

// src/modules/participants/use-cases/errors/participant-already-registered-error.ts
var ParticipantAlreadyRegisteredError = class extends AppError {
  constructor() {
    super("Participant data is already registered for this user", 409);
  }
};

// src/modules/participants/use-cases/errors/user-already-exists-error.ts
var UserAlreadyExistsError = class extends AppError {
  constructor() {
    super("E-mail already exists.", 409);
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

// src/modules/participants/use-cases/factories/make-update-participant-use-case.ts
function makeUpdateParticipantUseCase() {
  const participantsRepository = new PrismaParticipantsRepository();
  const useCase = new UpdateParticipantUseCase(participantsRepository);
  return useCase;
}

// src/modules/participants/http/controllers/update-participant-controller.ts
async function updateParticipantController(request, reply) {
  const bodySchema = import_zod2.z.object({
    full_name: import_zod2.z.string().min(5).optional(),
    phone_number: import_zod2.z.string().optional(),
    birthdate: import_zod2.z.coerce.date().optional(),
    document_number: import_zod2.z.string().optional(),
    document_type: import_zod2.z.enum(["CPF", "RG"]).optional(),
    guardian_name: import_zod2.z.string().optional().optional(),
    guardian_phone_number: import_zod2.z.string().optional().optional(),
    prayer_group: import_zod2.z.string().optional().optional(),
    community_type: import_zod2.z.enum(["VIDA", "ALIAN\xC7A"]).optional().optional(),
    pcd_description: import_zod2.z.string().optional().optional(),
    allergy_description: import_zod2.z.string().optional().optional(),
    medication_use_description: import_zod2.z.string().optional().optional()
  }).strict();
  const user_id = request.user.sub;
  const {
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
  } = bodySchema.parse(request.body);
  const updateParticipant = makeUpdateParticipantUseCase();
  const { participant } = await updateParticipant.execute({
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
  });
  return reply.status(200).send({ participant });
}

// src/modules/participants/http/controllers/create-participant-controller.ts
var import_zod3 = require("zod");

// src/modules/users/repositories/prisma/prisma-users-repository.ts
var PrismaUsersRepository = class {
  async findById(id) {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { participant: true }
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
  async findByIdWithRelations(id) {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { addresses: true }
    });
    return user;
  }
};

// src/modules/participants/use-cases/create-participant-use-case.ts
var CreateParticipantUseCase = class {
  constructor(participantsRepository, usersRepository) {
    this.participantsRepository = participantsRepository;
    this.usersRepository = usersRepository;
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
    const userExists = await this.usersRepository.findById(user_id);
    if (!userExists)
      throw new ResourceNotFoundError("User");
    if (userExists.role !== "PARTICIPANT")
      throw new ResourceNotFoundError("User");
    const participantDataExists = await this.participantsRepository.findByUser(
      user_id
    );
    if (participantDataExists)
      throw new ParticipantAlreadyRegisteredError();
    const participant = await this.participantsRepository.create({
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
    });
    return { participant };
  }
};

// src/modules/participants/use-cases/factories/make-create-participant-use-case.ts
function makeCreateParticipantUseCase() {
  const participantsRepository = new PrismaParticipantsRepository();
  const usersRepository = new PrismaUsersRepository();
  const useCase = new CreateParticipantUseCase(
    participantsRepository,
    usersRepository
  );
  return useCase;
}

// src/modules/participants/http/controllers/create-participant-controller.ts
async function createParticipantController(request, reply) {
  const bodySchema = import_zod3.z.object({
    full_name: import_zod3.z.string().min(5),
    phone_number: import_zod3.z.string(),
    birthdate: import_zod3.z.coerce.date(),
    document_number: import_zod3.z.string(),
    document_type: import_zod3.z.enum(["CPF", "RG"]),
    guardian_name: import_zod3.z.string().optional(),
    guardian_phone_number: import_zod3.z.string().optional(),
    prayer_group: import_zod3.z.string().optional(),
    community_type: import_zod3.z.enum(["VIDA", "ALIAN\xC7A"]).optional(),
    pcd_description: import_zod3.z.string().optional(),
    allergy_description: import_zod3.z.string().optional(),
    medication_use_description: import_zod3.z.string().optional()
  }).strict();
  const user_id = request.user.sub;
  const {
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
  } = bodySchema.parse(request.body);
  const createParticipant = makeCreateParticipantUseCase();
  const { participant } = await createParticipant.execute({
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
  });
  return reply.status(200).send({ participant });
}

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

// src/modules/participants/use-cases/factories/make-show-participant-by-user-use-case.ts
function makeShowParticipantByUserUseCase() {
  const participantssRepository = new PrismaParticipantsRepository();
  const useCase = new ShowParticipantByUserUseCase(participantssRepository);
  return useCase;
}

// src/modules/participants/http/controllers/show-participants-controller.ts
async function showParticipantController(request, reply) {
  const user_id = request.user.sub;
  const showParticipant = makeShowParticipantByUserUseCase();
  const { participant } = await showParticipant.execute({ user_id });
  return reply.status(200).send({ participant });
}

// src/modules/participants/http/routes/user-participants-routes.ts
async function userParticipantsRoutes(app) {
  const participantMiddlewares = {
    onRequest: [verifyJWT, verifyUserRole("PARTICIPANT")]
  };
  app.post(
    "/participants/me",
    participantMiddlewares,
    createParticipantController
  );
  app.get(
    "/participants/me",
    participantMiddlewares,
    showParticipantController
  );
  app.put(
    "/participants/me",
    participantMiddlewares,
    updateParticipantController
  );
}

// src/modules/participants/http/controllers/register-participanting-user-controller.ts
var import_zod4 = require("zod");

// src/modules/participants/use-cases/register-participanting-user-and-address-use-case.ts
var import_bcryptjs = require("bcryptjs");
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

// src/modules/addresses/repositories/prisma/prisma-addresses-repository.ts
var PrismaAddressesRepository = class {
  async findById(id) {
    const address = await prisma.address.findFirst({
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
  async findManyByUser(user_id) {
    const addresses = await prisma.address.findMany({
      where: { users: { some: { id: user_id } } }
    });
    return addresses;
  }
  async findManyByEvent(event_id) {
    const addresses = await prisma.address.findMany({
      where: { events: { some: { id: event_id } } }
    });
    return addresses;
  }
  async findByEvent(address_id, event_id) {
    const address = await prisma.address.findFirst({
      where: { id: address_id, events: { every: { id: event_id } } }
    });
    return address;
  }
};

// src/modules/participants/use-cases/factories/make-register-participant-user-and-address-use-case.ts
function makeRegisterParticipantUserAndAddressUseCase() {
  const participantsRepository = new PrismaParticipantsRepository();
  const usersRepository = new PrismaUsersRepository();
  const addressesRepository = new PrismaAddressesRepository();
  const useCase = new RegisterParticipantingUserAndAddressUseCase(
    participantsRepository,
    usersRepository,
    addressesRepository
  );
  return useCase;
}

// src/modules/participants/http/controllers/register-participanting-user-controller.ts
async function registerParticipantingUserController(request, reply) {
  const bodySchema = import_zod4.z.object({
    name: import_zod4.z.string(),
    email: import_zod4.z.string().email(),
    password: import_zod4.z.string().min(8),
    password_confirmation: import_zod4.z.string().min(8),
    street: import_zod4.z.string(),
    street_number: import_zod4.z.string(),
    complement: import_zod4.z.string().optional(),
    zip_code: import_zod4.z.string(),
    district: import_zod4.z.string(),
    city: import_zod4.z.string(),
    state: import_zod4.z.string(),
    full_name: import_zod4.z.string().min(5),
    phone_number: import_zod4.z.string(),
    birthdate: import_zod4.z.coerce.date(),
    document_number: import_zod4.z.string(),
    document_type: import_zod4.z.enum(["CPF", "RG"]),
    guardian_name: import_zod4.z.string().optional().optional(),
    guardian_phone_number: import_zod4.z.string().optional().optional(),
    prayer_group: import_zod4.z.string().optional().optional(),
    community_type: import_zod4.z.enum(["VIDA", "ALIAN\xC7A"]).optional().optional(),
    pcd_description: import_zod4.z.string().optional().optional(),
    allergy_description: import_zod4.z.string().optional().optional(),
    medication_use_description: import_zod4.z.string().optional().optional()
  }).strict().refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ["password_confirmation"]
  });
  const {
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
  } = bodySchema.parse(request.body);
  const registerParticipantingUser = makeRegisterParticipantUserAndAddressUseCase();
  const { participant } = await registerParticipantingUser.execute({
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
  });
  return reply.status(200).send({ participant });
}

// src/modules/participants/http/routes/publics-participants-routes.ts
async function publicsParticipantsRoutes(app) {
  app.post("/participants/register", registerParticipantingUserController);
}

// src/modules/participants/http/routes/index.ts
async function participantsRoutes(app) {
  app.register(publicsParticipantsRoutes);
  app.register(adminParticipantsRoutes);
  app.register(userParticipantsRoutes);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  participantsRoutes
});