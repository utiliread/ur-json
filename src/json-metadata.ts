import { JsonConverter } from "./json-converter";

export interface JsonMetadata {
  /**
   * The name of the json property
   */
  name?: string;

  /**
   * The type used to construct the property instance
   */
  type?: { new (): any };

  /**
   * The accessor used to get the type to construct the property instance
   */
  typeAccessor?: () => { new (): any };

  /**
   * The converter
   */
  converter?: JsonConverter;
}
