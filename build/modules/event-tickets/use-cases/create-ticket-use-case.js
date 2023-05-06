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

// src/modules/event-tickets/use-cases/create-ticket-use-case.ts
var create_ticket_use_case_exports = {};
__export(create_ticket_use_case_exports, {
  CreateTicketUseCase: () => CreateTicketUseCase
});
module.exports = __toCommonJS(create_ticket_use_case_exports);

// src/shared/errors/app-error.ts
var AppError = class {
  constructor(message, statusCode = 400) {
    this.message = message;
    this.statusCode = statusCode;
  }
};

// src/modules/event-tickets/use-cases/errors/resource-not-found-error.ts
var ResourceNotFoundError = class extends AppError {
  constructor() {
    super("Resource not found.", 404);
  }
};

// src/modules/event-tickets/use-cases/create-ticket-use-case.ts
var CreateTicketUseCase = class {
  constructor(ticketsRepository, eventsRepository) {
    this.ticketsRepository = ticketsRepository;
    this.eventsRepository = eventsRepository;
  }
  async execute({
    event_id,
    title,
    price,
    expires_in
  }) {
    const eventExists = await this.eventsRepository.findById(event_id);
    if (!eventExists)
      throw new ResourceNotFoundError();
    const ticket = await this.ticketsRepository.create({
      event_id,
      title,
      price,
      expires_in
    });
    if (!ticket)
      throw new ResourceNotFoundError();
    return { ticket };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CreateTicketUseCase
});
