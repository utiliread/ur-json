import { DateTime, DateTimeOptions } from "luxon";
import { JsonConverter } from "../json-converter";
declare class DateTimeConverter implements JsonConverter {
    options: DateTimeOptions;
    constructor(options?: DateTimeOptions);
    fromJson(source: any): DateTime;
}
export declare const dateTimeConverter: DateTimeConverter;
export {};
