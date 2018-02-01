"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.METADATA_KEY = 'jsonProperty';
/**
 * Attribute specifying a property to be serialized
 * @param nameOrMetadata The name of the json property or metadata describing how to construct the property
 */
function jsonProperty(nameOrMetadata) {
    let metadata = typeof (nameOrMetadata) === 'string' ? { name: nameOrMetadata } : nameOrMetadata;
    if (metadata && !!metadata.type && !!metadata.converter) {
        throw "Only one of type or converter can be specified";
    }
    return function (target, propertyKey) {
        Reflect.defineMetadata(exports.METADATA_KEY, metadata, target, propertyKey);
    };
}
exports.jsonProperty = jsonProperty;
function getPropertyMetadata(target, propertyKey) {
    return Reflect.getOwnMetadata(exports.METADATA_KEY, Object.getPrototypeOf(target), propertyKey);
}
exports.getPropertyMetadata = getPropertyMetadata;
//# sourceMappingURL=json-property.js.map