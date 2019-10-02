"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var luxon_1 = require("luxon");
var invalidDatetime = luxon_1.DateTime.invalid("invalid");
var LuxonConverter = /** @class */ (function () {
    function LuxonConverter() {
    }
    LuxonConverter.prototype.fromJson = function (source) {
        if (!source) {
            return invalidDatetime;
        }
        return luxon_1.DateTime.fromISO(source, { setZone: true });
    };
    return LuxonConverter;
}());
exports.luxonConverter = new LuxonConverter();
//# sourceMappingURL=luxon-converter.js.map