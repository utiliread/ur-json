"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serialize = void 0;
var base64_arraybuffer_1 = require("base64-arraybuffer");
function serialize(source) {
    return JSON.stringify(source, function (key, value) {
        if (value instanceof ArrayBuffer) {
            return (0, base64_arraybuffer_1.encode)(value);
        }
        return value;
    });
}
exports.serialize = serialize;
//# sourceMappingURL=serialize.js.map