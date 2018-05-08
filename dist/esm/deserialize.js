import { getPropertyMetadata, getPropertyNames } from './json-property';
import { decode } from 'base64-arraybuffer';
export function modelBind(type, source) {
    if (source === undefined || source === null || type.prototype === Array.prototype) {
        return source;
    }
    var destination = new type();
    // Get all the property names that has the jsonProperty attribute
    var propertyNames = new Set(getPropertyNames(destination));
    if (Object.getPrototypeOf(destination) === Object.prototype) {
        // The type is Object, assume a dictionary and read all the keys from the source
        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                propertyNames.add(key);
            }
        }
    }
    else {
        // The type is a custom type, get all (assigned) property names from the destination (which does not have the jsonProperty attribute)
        for (var key in destination) {
            if (destination.hasOwnProperty(key)) {
                propertyNames.add(key);
            }
        }
    }
    for (var _i = 0, _a = Array.from(propertyNames); _i < _a.length; _i++) {
        var propertyName = _a[_i];
        var propertyMetadata = getPropertyMetadata(destination, propertyName);
        if (propertyMetadata) {
            destination[propertyName] = getValue(source, destination, propertyName, propertyMetadata);
        }
        else if (source[propertyName] !== undefined) {
            destination[propertyName] = source[propertyName];
        }
    }
    return destination;
}
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
        return decode(source[propertyName]);
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