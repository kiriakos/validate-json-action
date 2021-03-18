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
var ConfigKey;
(function (ConfigKey) {
    ConfigKey["GITHUB_WORKSPACE"] = "GITHUB_WORKSPACE";
    ConfigKey["SCHEMA"] = "SCHEMA";
    ConfigKey["JSONS"] = "JSONS";
})(ConfigKey = exports.ConfigKey || (exports.ConfigKey = {}));
exports.configMapping = [
    {
        key: ConfigKey.GITHUB_WORKSPACE,
        setup: 'ENV',
    },
    { key: ConfigKey.SCHEMA, setup: 'INPUT' },
    { key: ConfigKey.JSONS, setup: 'INPUT' },
];
function getConfig() {
    let config = {};
    exports.configMapping.forEach(i => {
        let value;
        switch (i.setup) {
            case 'ENV':
                value = process.env[ConfigKey[i.key]];
                break;
            case 'INPUT':
                value = core.getInput(ConfigKey[i.key]);
                break;
            default:
                value = '';
                break;
        }
        core.debug(`${ConfigKey[i.key]}: ${value}`);
        config[ConfigKey[i.key]] = value;
    });
    return config;
}
exports.getConfig = getConfig;
function verifyConfigValues(config) {
    let errors = [];
    Object.keys(config).forEach(key => {
        if (config[key] === '') {
            const mapping = exports.configMapping.find(i => i.key === key);
            errors.push(`🚨 Missing ${key} ${mapping.setup === 'ENV' ? 'environment variable' : mapping.setup.toLowerCase()}`);
        }
    });
    return errors.length > 0 ? errors : undefined;
}
exports.verifyConfigValues = verifyConfigValues;
