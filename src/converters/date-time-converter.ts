import { DateTime } from "luxon";
import { JsonConverter } from "../json-converter";

class DateTimeConverter implements JsonConverter {
    fromJson(source: any) {
        return DateTime.fromISO(source, { setZone: true });
    }
}

export const dateTimeConverter = new DateTimeConverter();