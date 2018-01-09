"use strict";
import { METADATA_KEY } from './json-metadata';
/**
 * Attribute specifying a property to be serialized
 * @param nameOrMetadata The name of the json property or metadata describing how to construct the property
 */
export function jsonProperty(nameOrMetadata) {
    let metadata = typeof (nameOrMetadata) === 'string' ? { name: nameOrMetadata } : nameOrMetadata;
    if (metadata && !!metadata.type && !!metadata.ctor) {
        throw "Only one of type or ctor can be specified";
    }
    return function (target, propertyKey) {
        Reflect.defineMetadata(METADATA_KEY, metadata, target, propertyKey);
    };
}