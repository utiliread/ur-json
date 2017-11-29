"use strict";
import { METADATA_KEY } from './json-metadata';
export function deserialize(type, source) {
    if (source === undefined) {
        return undefined;
    }
    if (source === null) {
        return null;
    }
    var destination = new type();
    for (var key in destination) {
        var propertyMetadata = getJsonPropertyMetadata(destination, key);
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
export function deserializeArray(type, source) {
    return source.map(function (x) { return deserialize(type, x); });
}
var isPrimitive = function (object) {
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
var isArray = function (object) {
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
var getJsonPropertyMetadata = function (target, propertyKey) {
    return Reflect.getOwnMetadata(METADATA_KEY, Object.getPrototypeOf(target), propertyKey);
};
var getValue = function (source, destination, key, propertyMetadata) {
    var propertyName = propertyMetadata.name || key;
    var type = getType(destination, key);
    var propertyMetadataCtor = propertyMetadata.ctor;
    var propertyMetadataType = propertyMetadata.type;
    if (isArray(type)) {
        if (propertyMetadataCtor) {
            if (isArray(source[propertyName])) {
                return source[propertyName].map(function (item) { return propertyMetadataCtor(item); });
            }
            else {
                return propertyMetadataCtor(source[propertyName]);
            }
        }
        else if (propertyMetadataType) {
            if (isArray(source[propertyName])) {
                return source[propertyName].map(function (item) { return deserialize(propertyMetadataType, item); });
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
var getType = function (target, propertyKey) {
    return Reflect.getOwnMetadata("design:type", Object.getPrototypeOf(target), propertyKey);
};
