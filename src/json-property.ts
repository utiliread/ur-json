import { JsonMetadata } from './json-metadata';

export const METADATA_KEY = 'jsonProperty';

/**
 * Attribute specifying a property to be serialized
 * @param nameOrMetadata The name of the json property or metadata describing how to construct the property
 */
export function jsonProperty(nameOrMetadata?: string | JsonMetadata) {
    let metadata: JsonMetadata = {};
    
    if (typeof nameOrMetadata === 'string') {
        metadata.name = nameOrMetadata;
    }
    else if (nameOrMetadata) {
        metadata = nameOrMetadata;
    }

    if (!!metadata.type && !!metadata.converter) {
        throw "Only one of type or converter can be specified";
    }

    return function (target: any, propertyKey: string) {
        Reflect.defineMetadata(METADATA_KEY, metadata, target, propertyKey);
    };
}

export function getPropertyMetadata(target: any, propertyKey: string): JsonMetadata | undefined {
    return Reflect.getOwnMetadata(METADATA_KEY, Object.getPrototypeOf(target), propertyKey);
}