import { JsonMetadata } from './json-metadata';
export declare const METADATA_KEY = "jsonProperty";
/**
 * Attribute specifying a property to be serialized
 * @param nameOrMetadata The name of the json property or metadata describing how to construct the property
 */
export declare function jsonProperty(nameOrMetadata?: string | JsonMetadata): (target: any, propertyKey: string) => void;
export declare function getPropertyMetadata(target: any, propertyKey: string): JsonMetadata | undefined;
