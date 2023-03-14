export interface JsonConverter {
  /**
   * Indicates whether `null` should be passed to the converter on serialization.
   * The default value is false.
   */
  handleNull?: boolean;
  
  /**
   * Indicates whether `undefined` should be passed to the converter on serialization.
   * The default value is false.
   */
  handleUndefined?: boolean;
  toJson?(source: any): any;
  fromJson?(source: any): any;
}

export interface JsonConverterOfT<T> {
  /**
   * Indicates whether `null` should be passed to the converter on serialization.
   * The default value is false.
   */
  handleNull?: boolean;
  
  /**
   * Indicates whether `undefined` should be passed to the converter on serialization.
   * The default value is false.
   */
  handleUndefined?: boolean;
  toJson?(source: T): any;
  fromJson?(source: any): T;
}
