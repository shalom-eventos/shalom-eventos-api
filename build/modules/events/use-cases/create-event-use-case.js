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

// src/modules/events/use-cases/create-event-use-case.ts
var create_event_use_case_exports = {};
__export(create_event_use_case_exports, {
  CreateEventUseCase: () => CreateEventUseCase
});
module.exports = __toCommonJS(create_event_use_case_exports);
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

// src/shared/utils/generate-slug.ts
var generateSlug = ({
  keyword,
  separator = "-",
  withHash = false,
  hash
}) => {
  const slug = `${keyword.toLowerCase()}`.replace(
    /([^a-z0-9 ]+)|\s/gi,
    separator
  );
  if (!withHash)
    return slug;
  const hashCode = hash ?? String((/* @__PURE__ */ new Date()).getTime()).substring(8);
  return slug + separator + hashCode;
};

// src/modules/events/use-cases/create-event-use-case.ts
var CreateEventUseCase = class {
  constructor(eventsRepository) {
    this.eventsRepository = eventsRepository;
  }
  async execute({
    title,
    description,
    start_date,
    end_date
  }) {
    const endDate = end_date ? end_date : (0, import_dayjs.default)(start_date).endOf("date").toDate();
    if ((0, import_dayjs.default)(start_date).isAfter(end_date))
      throw new InvalidDateIntervalError();
    let slug = generateSlug({ keyword: title });
    for (let i = 1; i < 1e3; i++) {
      const slugExists = await this.eventsRepository.findBySlug(slug);
      if (slugExists) {
        slug = generateSlug({
          keyword: title,
          withHash: true,
          hash: String(i)
        });
      } else {
        break;
      }
    }
    const event = await this.eventsRepository.create({
      slug,
      title,
      description,
      start_date,
      end_date: endDate
    });
    return { event };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CreateEventUseCase
});
