import { JsonMetadata } from './json-metadata';
/**
 * Attribute specifying a property to be serialized
 * @param nameOrMetadata The name of the json property or metadata describing how to construct the property
 */
export declare function jsonProperty<T>(nameOrMetadata?: string | JsonMetadata<T>): (target: any, propertyKey: string) => void;
