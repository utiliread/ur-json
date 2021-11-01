"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPropertyNames = exports.getPropertyMetadata = exports.jsonProperty = void 0;
var PROPERTY_METADATA_KEY = 'jsonProperty';
var PROPERTY_NAMES_METADATA_KEY = 'jsonPropertyNames';
/**
 * Attribute specifying a property to be serialized
 * @param nameOrMetadata The name of the json property or metadata describing how to construct the property
 */
function jsonProperty(nameOrMetadata) {
    var metadata = {};
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
        var propertyNames = Reflect.getOwnMetadata(PROPERTY_NAMES_METADATA_KEY, target) || [];
        propertyNames.push(propertyKey);
        Reflect.defineMetadata(PROPERTY_NAMES_METADATA_KEY, propertyNames, target);
        Reflect.defineMetadata(PROPERTY_METADATA_KEY, metadata, target, propertyKey);
    };
}
exports.jsonProperty = jsonProperty;
function getPropertyMetadata(instance, propertyKey) {
    var target = Object.getPrototypeOf(instance);
    while (target !== Object.prototype) {
        var metadata = Reflect.getOwnMetadata(PROPERTY_METADATA_KEY, target, propertyKey);
        if (metadata) {
            return metadata;
        }
        target = Object.getPrototypeOf(target);
    }
}
exports.getPropertyMetadata = getPropertyMetadata;
function getPropertyNames(instance) {
    var names = [];
    var target = Object.getPrototypeOf(instance);
    while (target !== Object.prototype) {
        var propertyNames = Reflect.getOwnMetadata(PROPERTY_NAMES_METADATA_KEY, target);
        names.push.apply(names, propertyNames);
        target = Object.getPrototypeOf(target); // Set target to base class
    }
    return names;
}
exports.getPropertyNames = getPropertyNames;
//# sourceMappingURL=json-property.js.map