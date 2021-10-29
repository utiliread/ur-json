export interface JsonConverter {
    toJson?(source: any): any;
    fromJson?(source: any): any;
}
