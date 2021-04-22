"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateTimeConverter = void 0;
var luxon_1 = require("luxon");
var DateTimeConverter = /** @class */ (function () {
    function DateTimeConverter() {
    }
    DateTimeConverter.prototype.fromJson = function (source) {
        return luxon_1.DateTime.fromISO(source, { setZone: true });
    };
    return DateTimeConverter;
}());
exports.dateTimeConverter = new DateTimeConverter();
//# sourceMappingURL=date-time-converter.js.map