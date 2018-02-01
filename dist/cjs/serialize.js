"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base64_arraybuffer_1 = require("base64-arraybuffer");
function serialize(source) {
    return JSON.stringify(source, (key, value) => {
        if (value instanceof ArrayBuffer) {
            return base64_arraybuffer_1.encode(value);
        }
        return value;
    });
}
exports.serialize = serialize;
//# sourceMappingURL=serialize.js.map