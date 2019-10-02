import { DateTime } from "luxon";
import { JsonConverter } from "../json-converter";
declare class LuxonConverter implements JsonConverter {
    fromJson(source: any): DateTime;
}
export declare const luxonConverter: LuxonConverter;
export {};
