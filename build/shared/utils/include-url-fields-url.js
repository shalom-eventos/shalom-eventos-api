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

// src/shared/utils/include-url-fields-url.ts
var include_url_fields_url_exports = {};
__export(include_url_fields_url_exports, {
  includeURLFields: () => includeURLFields
});
module.exports = __toCommonJS(include_url_fields_url_exports);
function includeURLFields(model, keys) {
  let newModel = { ...model };
  for (let key of keys) {
    const newKey = `${String(key)}_url`;
    const newValue = `${newKey}/files/${model[key]}`;
    newModel = { ...model, newKey: newValue };
  }
  return newModel;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  includeURLFields
});
