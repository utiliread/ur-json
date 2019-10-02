import { DateTime } from "luxon";
var invalidDatetime = DateTime.invalid("invalid");
var LuxonConverter = /** @class */ (function () {
    function LuxonConverter() {
    }
    LuxonConverter.prototype.fromJson = function (source) {
        if (!source) {
            return invalidDatetime;
        }
        return DateTime.fromISO(source, { setZone: true });
    };
    return LuxonConverter;
}());
export var luxonConverter = new LuxonConverter();
//# sourceMappingURL=luxon-converter.js.map