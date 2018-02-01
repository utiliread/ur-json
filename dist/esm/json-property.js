export const METADATA_KEY = 'jsonProperty';
/**
 * Attribute specifying a property to be serialized
 * @param nameOrMetadata The name of the json property or metadata describing how to construct the property
 */
export function jsonProperty(nameOrMetadata) {
    let metadata = {};
    if (typeof nameOrMetadata === 'string') {
        metadata.name = nameOrMetadata;
    }
    else if (nameOrMetadata) {
        metadata = nameOrMetadata;
    }
    if (!!metadata.type && !!metadata.converter) {
        throw "Only one of type or converter can be specified";
    }
    return function (target, propertyKey) {
        Reflect.defineMetadata(METADATA_KEY, metadata, target, propertyKey);
    };
}
export function getPropertyMetadata(target, propertyKey) {
    return Reflect.getOwnMetadata(METADATA_KEY, Object.getPrototypeOf(target), propertyKey);
}
//# sourceMappingURL=json-property.js.map