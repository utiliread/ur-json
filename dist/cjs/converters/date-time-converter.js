"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateTimeConverter = void 0;
var luxon_1 = require("luxon");
var DateTimeConverter = /** @class */ (function () {
    function DateTimeConverter(options) {
        this.options = options !== null && options !== void 0 ? options : { setZone: true };
    }
    DateTimeConverter.prototype.fromJson = function (source) {
        return luxon_1.DateTime.fromISO(source, this.options);
    };
    return DateTimeConverter;
}());
exports.dateTimeConverter = new DateTimeConverter();
//# sourceMappingURL=date-time-converter.js.map