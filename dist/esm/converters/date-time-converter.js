import { DateTime } from "luxon";
var DateTimeConverter = /** @class */ (function () {
    function DateTimeConverter() {
    }
    DateTimeConverter.prototype.fromJson = function (source) {
        return DateTime.fromISO(source, { setZone: true });
    };
    return DateTimeConverter;
}());
export var dateTimeConverter = new DateTimeConverter();
//# sourceMappingURL=date-time-converter.js.map