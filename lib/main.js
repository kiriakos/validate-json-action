"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const glob = __importStar(require("@actions/glob"));
const configuration_1 = require("./configuration");
const json_validator_1 = require("./json-validator");
async function run() {
    try {
        const configuration = configuration_1.getConfig();
        const configurationErrors = configuration_1.verifyConfigValues(configuration);
        if (configurationErrors) {
            configurationErrors.forEach(e => core.error(e));
            core.setFailed('Missing configuration');
            return;
        }
        const patterns = configuration.JSONS.split(',');
        const globber = await glob.create(patterns.join('\n'));
        const jsonRelativePaths = await globber.glob();
        const validationResults = await json_validator_1.validateJsons(configuration.GITHUB_WORKSPACE, configuration.SCHEMA, jsonRelativePaths);
        const invalidJsons = validationResults.filter(res => !res.valid).map(res => res.filePath);
        core.setOutput('INVALID', invalidJsons.length > 0 ? invalidJsons.join(',') : '');
        if (invalidJsons.length > 0) {
            core.setFailed('Failed to validate all JSON files.');
        }
        else {
            core.info(`✅ All files were validated successfully.`);
        }
    }
    catch (error) {
        core.setFailed(error.message);
    }
}
run();
