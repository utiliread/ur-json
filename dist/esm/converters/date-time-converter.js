import { DateTime } from "luxon";
var DateTimeConverter = /** @class */ (function () {
    function DateTimeConverter(options) {
        this.options = options !== null && options !== void 0 ? options : { setZone: true };
    }
    DateTimeConverter.prototype.fromJson = function (source) {
        return DateTime.fromISO(source, this.options);
    };
    return DateTimeConverter;
}());
export var dateTimeConverter = new DateTimeConverter();
//# sourceMappingURL=date-time-converter.js.map