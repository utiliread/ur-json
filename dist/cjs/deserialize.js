"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var base64_arraybuffer_1 = require("base64-arraybuffer");
var json_property_1 = require("./json-property");
function modelBind(type, source) {
    if (source === undefined || source === null) {
        return source;
    }
    var destination = new type();
    for (var key in destination) {
        var propertyMetadata = json_property_1.getPropertyMetadata(destination, key);
        if (propertyMetadata) {
            destination[key] = getValue(source, destination, key, propertyMetadata);
        }
        else if (source[key] !== undefined) {
            destination[key] = source[key];
        }
    }
    return destination;
}
exports.modelBind = modelBind;
function getValue(source, destination, key, propertyMetadata) {
    var propertyName = propertyMetadata.name || key;
    var propertyType = getPropertyType(destination, key);
    var fromJson = propertyMetadata.converter ? propertyMetadata.converter.fromJson : undefined;
    if (isArray(propertyType)) {
        var type_1 = propertyMetadata.type;
        if (fromJson) {
            if (isArray(source[propertyName])) {
                return source[propertyName].map(function (item) { return fromJson(item); });
            }
            else {
                return fromJson(source[propertyName]);
            }
        }
        else if (type_1) {
            if (isArray(source[propertyName])) {
                return source[propertyName].map(function (item) { return modelBind(type_1, item); });
            }
            else {
                return undefined;
            }
        }
    }
    if (fromJson) {
        return fromJson(source[propertyName]);
    }
    else if (propertyType === ArrayBuffer) {
        return base64_arraybuffer_1.decode(source[propertyName]);
    }
    else if (!isPrimitive(propertyType)) {
        return modelBind(propertyType, source[propertyName]);
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