import { DateTime } from "luxon";
var invalid = DateTime.invalid("invalid");
var DateTimeConverter = /** @class */ (function () {
    function DateTimeConverter() {
    }
    DateTimeConverter.prototype.fromJson = function (source) {
        if (!source) {
            return invalid;
        }
        return DateTime.fromISO(source, { setZone: true });
    };
    return DateTimeConverter;
}());
export var dateTimeConverter = new DateTimeConverter();
//# sourceMappingURL=date-time-converter.js.map