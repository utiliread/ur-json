import { JsonConverter } from "../json-converter";
declare class RawConverter implements JsonConverter {
    fromJson(source: any): any;
}
export declare const rawConverter: RawConverter;
export {};
