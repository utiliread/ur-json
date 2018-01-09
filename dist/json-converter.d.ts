export declare abstract class JsonConverter<T> {
    abstract convert(source: any): T;
    convertArray(source: any[]): T[];
}
