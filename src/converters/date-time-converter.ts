import { DateTime } from "luxon";
import { JsonConverter } from "../json-converter";

const invalid = DateTime.invalid("invalid");

class DateTimeConverter implements JsonConverter {
    fromJson(source: any) {
        if (!source) {
            return invalid;
        }
        return DateTime.fromISO(source, { setZone: true });
    }
}

export const dateTimeConverter = new DateTimeConverter();