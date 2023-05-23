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

// src/shared/utils/generate-slug.ts
var generate_slug_exports = {};
__export(generate_slug_exports, {
  generateSlug: () => generateSlug
});
module.exports = __toCommonJS(generate_slug_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  generateSlug
});
