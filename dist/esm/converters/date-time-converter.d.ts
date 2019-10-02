import { DateTime } from "luxon";
import { JsonConverter } from "../json-converter";
declare class DateTimeConverter implements JsonConverter {
    fromJson(source: any): DateTime;
}
export declare const dateTimeConverter: DateTimeConverter;
export {};
