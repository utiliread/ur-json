'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const METADATA_KEY = "jsonProperty";

function deserialize(type, source) {
    if (source === undefined || source === null) {
        return null;
    }
    let destination = new type();
    for (let key in destination) {
        let propertyMetadata = getJsonPropertyMetadata(destination, key);
        if (propertyMetadata) {
            destination[key] = getValue(source, destination, key, propertyMetadata);
        }
        else {
            if (source[key] !== undefined) {
                destination[key] = source[key];
            }
        }
    }
    return destination;
}
const isPrimitive = (object) => {
    switch (typeof object) {
        case "string":
        case "number":
        case "boolean":
            return true;
    }
    return !!(object instanceof String || object === String ||
        object instanceof Number || object === Number ||
        object instanceof Boolean || object === Boolean);
};
const isArray = (object) => {
    if (object === Array) {
        return true;
    }
    else if (typeof Array.isArray === "function") {
        return Array.isArray(object);
    }
    else {
        return !!(object instanceof Array);
    }
};
const getJsonPropertyMetadata = (target, propertyKey) => Reflect.getOwnMetadata(METADATA_KEY, Object.getPrototypeOf(target), propertyKey);
const getValue = (source, destination, key, propertyMetadata) => {
    let propertyName = propertyMetadata.name || key;
    let type = getType(destination, key);
    const propertyMetadataCtor = propertyMetadata.ctor;
    const propertyMetadataType = propertyMetadata.type;
    if (isArray(type)) {
        if (propertyMetadataCtor) {
            if (isArray(source[propertyName])) {
                return source[propertyName].map((item) => propertyMetadataCtor(item));
            }
            else {
                return propertyMetadataCtor(source[propertyName]);
            }
        }
        else if (propertyMetadataType) {
            if (isArray(source[propertyName])) {
                return source[propertyName].map((item) => deserialize(propertyMetadataType, item));
            }
            else {
                return undefined;
            }
        }
    }
    if (propertyMetadataCtor) {
        return propertyMetadataCtor(source[propertyName]);
    }
    else if (!isPrimitive(type)) {
        return deserialize(type, source[propertyName]);
    }
    else {
        return source[propertyName];
    }
};
const getType = (target, propertyKey) => Reflect.getOwnMetadata("design:type", Object.getPrototypeOf(target), propertyKey);

class JsonConverter {
}

/**
 * Attribute specifying a property to be serialized
 * @param nameOrMetadata The name of the json property or metadata describing how to construct the property
 */
function jsonProperty(nameOrMetadata) {
    let metadata = typeof (nameOrMetadata) === 'string' ? { name: nameOrMetadata } : nameOrMetadata;
    if (metadata && !!metadata.type && !!metadata.ctor) {
        throw "Only one of type or ctor can be specified";
    }
    return function (target, propertyKey) {
        Reflect.defineMetadata(METADATA_KEY, metadata, target, propertyKey);
    };
}

exports.deserialize = deserialize;
exports.JsonConverter = JsonConverter;
exports.jsonProperty = jsonProperty;
