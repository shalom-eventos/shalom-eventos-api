"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/modules/events/use-cases/update-event-use-case.ts
var update_event_use_case_exports = {};
__export(update_event_use_case_exports, {
  UpdateEventUseCase: () => UpdateEventUseCase
});
module.exports = __toCommonJS(update_event_use_case_exports);
var import_dayjs = __toESM(require("dayjs"));

// src/shared/errors/app-error.ts
var AppError = class {
  constructor(message, statusCode = 400) {
    this.message = message;
    this.statusCode = statusCode;
  }
};

// src/modules/events/use-cases/errors/invalid-date-interval-error.ts
var InvalidDateIntervalError = class extends AppError {
  constructor() {
    super("Invalid date interval.", 403);
  }
};

// src/modules/events/use-cases/errors/resource-not-found-error.ts
var ResourceNotFoundError = class extends AppError {
  constructor() {
    super("Resource not found.", 404);
  }
};

// src/modules/events/use-cases/update-event-use-case.ts
var UpdateEventUseCase = class {
  constructor(eventsRepository) {
    this.eventsRepository = eventsRepository;
  }
  async execute(id, { title, description, start_date, end_date }) {
    const event = await this.eventsRepository.findById(id);
    if (!event)
      throw new ResourceNotFoundError();
    if (title)
      event.title = title;
    if (description)
      event.description = description;
    if (start_date && end_date) {
      if ((0, import_dayjs.default)(start_date).isAfter(end_date))
        throw new InvalidDateIntervalError();
    }
    if (start_date) {
      if ((0, import_dayjs.default)(start_date).isAfter(event.end_date))
        throw new InvalidDateIntervalError();
      event.start_date = start_date;
    }
    if (end_date) {
      if ((0, import_dayjs.default)(end_date).isBefore(event.start_date))
        throw new InvalidDateIntervalError();
      event.end_date = end_date;
    }
    await this.eventsRepository.save(event);
    return { event };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  UpdateEventUseCase
});
