const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

process.env.NODE_ENV = "test";

/** @type {import("jest").Config} **/
module.exports = {
  preset: 'ts-jest',
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.ts", "**/?(*.)+(test).ts"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/", "/src/startup/", "/src/app.test.ts"],
  transform: {
    ...tsJestTransformCfg,
  },
};