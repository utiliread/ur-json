export abstract class JsonConverter<T> {
    abstract convert(source: any): T;

    convertArray(source: any[]): T[] {
        return source.map(this.convert.bind(this));
    }
}