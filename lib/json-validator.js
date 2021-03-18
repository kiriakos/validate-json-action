"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const json_file_reader_1 = require("./json-file-reader");
const schema_validator_1 = require("./schema-validator");
const logger_1 = require("./logger");
exports.validateJsons = async (sourceDir, schemaRelativePath, jsonRelativePaths) => {
    const schemaPath = path_1.default.join(sourceDir, schemaRelativePath);
    try {
        const schema = await json_file_reader_1.getJson(schemaPath);
        const validatorFunc = await schema_validator_1.schemaValidator.prepareSchema(schema);
        logger_1.prettyLog(schemaPath);
        return await Promise.all(jsonRelativePaths.map(async (relativePath) => {
            const filePath = path_1.default.join(sourceDir, relativePath);
            try {
                const jsonData = await json_file_reader_1.getJson(filePath);
                const result = await schema_validator_1.schemaValidator.validate(jsonData, validatorFunc);
                logger_1.prettyLog(filePath);
                return { filePath, valid: result };
            }
            catch (e) {
                logger_1.prettyLog(filePath, e);
                return { filePath, valid: false };
            }
        }));
    }
    catch (err) {
        logger_1.prettyLog(schemaPath, err);
        return [{ filePath: schemaPath, valid: false }];
    }
};
