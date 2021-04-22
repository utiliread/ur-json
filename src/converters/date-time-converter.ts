import { DateTime, DateTimeOptions } from "luxon";
import { JsonConverter } from "../json-converter";

class DateTimeConverter implements JsonConverter {
    public options: DateTimeOptions;

    constructor(options?: DateTimeOptions) {
        this.options = options ?? { setZone: true };
    }

    fromJson(source: any) {
        return DateTime.fromISO(source, this.options);
    }
}

export const dateTimeConverter = new DateTimeConverter();