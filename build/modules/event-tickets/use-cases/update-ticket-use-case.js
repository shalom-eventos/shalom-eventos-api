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

// src/modules/event-tickets/use-cases/update-ticket-use-case.ts
var update_ticket_use_case_exports = {};
__export(update_ticket_use_case_exports, {
  UpdateEventTicketUseCase: () => UpdateEventTicketUseCase
});
module.exports = __toCommonJS(update_ticket_use_case_exports);
var import_client = require("@prisma/client");

// src/shared/errors/app-error.ts
var AppError = class {
  constructor(message, statusCode = 400) {
    this.message = message;
    this.statusCode = statusCode;
  }
};

// src/modules/event-tickets/use-cases/errors/resource-not-found-or-expired-error.ts
var ResourceNotFoundOrExpiredError = class extends AppError {
  constructor() {
    super("Resource not found or Expired.", 404);
  }
};

// src/modules/event-tickets/use-cases/update-ticket-use-case.ts
var UpdateEventTicketUseCase = class {
  constructor(ticketsRepository) {
    this.ticketsRepository = ticketsRepository;
  }
  async execute(id, { title, price, expires_in }) {
    const ticket = await this.ticketsRepository.findByIdIfEventNotExpired(id);
    if (!ticket)
      throw new ResourceNotFoundOrExpiredError();
    if (title)
      ticket.title = title;
    if (price)
      ticket.price = new import_client.Prisma.Decimal(price);
    if (expires_in)
      ticket.expires_in = expires_in;
    await this.ticketsRepository.save(ticket);
    return { ticket };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  UpdateEventTicketUseCase
});
