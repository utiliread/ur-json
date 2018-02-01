"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const json_property_1 = require("./json-property");
function deserialize(type, source) {
    if (source === undefined || source === null) {
        return null;
    }
    let destination = new type();
    for (let key in destination) {
        let propertyMetadata = json_property_1.getPropertyMetadata(destination, key);
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
exports.deserialize = deserialize;
function getValue(source, destination, key, propertyMetadata) {
    let propertyName = propertyMetadata.name || key;
    let propertyType = getPropertyType(destination, key);
    const fromJson = propertyMetadata.converter ? propertyMetadata.converter.fromJson : undefined;
    if (isArray(propertyType)) {
        const type = propertyMetadata.type;
        if (fromJson) {
            if (isArray(source[propertyName])) {
                return source[propertyName].map((item) => fromJson(item));
            }
            else {
                return fromJson(source[propertyName]);
            }
        }
        else if (type) {
            if (isArray(source[propertyName])) {
                return source[propertyName].map((item) => deserialize(type, item));
            }
            else {
                return undefined;
            }
        }
    }
    if (fromJson) {
        return fromJson(source[propertyName]);
    }
    else if (!isPrimitive(propertyType)) {
        return deserialize(propertyType, source[propertyName]);
    }
    else {
        return source[propertyName];
    }
}
;
function getPropertyType(target, propertyKey) {
    return Reflect.getOwnMetadata("design:type", Object.getPrototypeOf(target), propertyKey);
}
function isArray(object) {
    if (object === Array) {
        return true;
    }
    else if (typeof Array.isArray === "function") {
        return Array.isArray(object);
    }
    else {
        return object instanceof Array;
    }
}
function isPrimitive(object) {
    switch (typeof object) {
        case "string":
        case "number":
        case "boolean":
            return true;
    }
    return (object instanceof String || object === String ||
        object instanceof Number || object === Number ||
        object instanceof Boolean || object === Boolean);
}
//# sourceMappingURL=deserialize.js.map