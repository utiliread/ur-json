export interface JsonConverter {
  toJson?(source: any): any;
  fromJson?(source: any): any;
}

export interface JsonConverterOfT<T> {
  toJson?(source: T): any;
  fromJson?(source: any): T;
}
