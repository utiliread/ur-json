export abstract class JsonConverter<T> {
    abstract convert(source: any): T;
}