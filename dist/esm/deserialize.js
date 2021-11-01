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
    var _a, _b;
    var propertyName = (_a = propertyMetadata.name) !== null && _a !== void 0 ? _a : key;
    var propertyType = getPropertyType(destination, key);
    var fromJsonConverter = ((_b = propertyMetadata.converter) === null || _b === void 0 ? void 0 : _b.fromJson) ? propertyMetadata.converter : undefined;
    if (isArray(propertyType)) {
        var type_1 = propertyMetadata.type;
        if (fromJsonConverter) {
            if (isArray(source[propertyName])) {
                return source[propertyName].map(function (item) { return runConverter(fromJsonConverter, item); });
            }
            else {
                return runConverter(fromJsonConverter, source[propertyName]);
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
    if (fromJsonConverter) {
        return runConverter(fromJsonConverter, source[propertyName]);
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
function runConverter(converter, source) {
    if (source === null || source === undefined) {
        return source;
    }
    return converter.fromJson(source);
}
function getPropertyType(destination, propertyKey) {
    var target = Object.getPrototypeOf(destination);
    while (target !== Object.prototype) {
        var propertyType = Reflect.getOwnMetadata("design:type", target, propertyKey);
        if (propertyType) {
            return propertyType;
        }
        target = Object.getPrototypeOf(target);
    }
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