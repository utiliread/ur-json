import { JsonMetadata } from './json-metadata';

const PROPERTY_METADATA_KEY = 'jsonProperty';
const PROPERTY_NAMES_METADATA_KEY = 'jsonPropertyNames';

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
        const propertyNames = Reflect.getOwnMetadata(PROPERTY_NAMES_METADATA_KEY, target) || [];
        
        propertyNames.push(propertyKey);
        Reflect.defineMetadata(PROPERTY_NAMES_METADATA_KEY, propertyNames, target);
        Reflect.defineMetadata(PROPERTY_METADATA_KEY, metadata, target, propertyKey);
    };
}

export function getPropertyMetadata(instance: any, propertyKey: string): JsonMetadata | undefined {
    return Reflect.getOwnMetadata(PROPERTY_METADATA_KEY, Object.getPrototypeOf(instance), propertyKey);
}

export function getPropertyNames(instance: any): string[] {
    return Reflect.getOwnMetadata(PROPERTY_NAMES_METADATA_KEY, Object.getPrototypeOf(instance)) || [];
}