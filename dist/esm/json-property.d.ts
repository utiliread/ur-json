import { JsonMetadata } from './json-metadata';
/**
 * Attribute specifying a property to be serialized
 * @param nameOrMetadata The name of the json property or metadata describing how to construct the property
 */
export declare function jsonProperty(nameOrMetadata?: string | JsonMetadata): (target: any, propertyKey: string) => void;
export declare function getPropertyMetadata(instance: any, propertyKey: string): JsonMetadata | undefined;
export declare function getPropertyNames(instance: any): string[];
