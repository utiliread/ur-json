"use strict";
import { METADATA_KEY } from './json-metadata';
export function deserialize(type, source) {
    if (source === undefined) {
        return undefined;
    }
    if (source === null) {
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
export function deserializeArray(type, source) {
    return source.map(x => deserialize(type, x));
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
