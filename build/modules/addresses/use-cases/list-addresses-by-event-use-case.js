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

// src/modules/addresses/use-cases/list-addresses-by-event-use-case.ts
var list_addresses_by_event_use_case_exports = {};
__export(list_addresses_by_event_use_case_exports, {
  ListAddressesByEventUseCase: () => ListAddressesByEventUseCase
});
module.exports = __toCommonJS(list_addresses_by_event_use_case_exports);
var ListAddressesByEventUseCase = class {
  constructor(addressesRepository) {
    this.addressesRepository = addressesRepository;
  }
  async execute({ event_id }) {
    const addresses = await this.addressesRepository.findManyByEvent(event_id);
    return { addresses };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ListAddressesByEventUseCase
});
