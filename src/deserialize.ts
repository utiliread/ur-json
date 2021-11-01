import { getPropertyMetadata, getPropertyNames } from './json-property';

import { JsonMetadata } from './json-metadata';
import { decode } from 'base64-arraybuffer';
import { JsonConverter } from './json-converter';

export function modelBind<T>(type: { new(): T }, source: any): T | null | undefined {
    if (source === undefined || source === null || type.prototype === Array.prototype) {
        return source;
    }

    const destination: any = new type();

    // Get all the property names that has the jsonProperty attribute
    const propertyNames = new Set<string>(getPropertyNames(destination));

    if (Object.getPrototypeOf(destination) === Object.prototype) {
        // The type is Object, assume a dictionary and read all the keys from the source
        for (const key in source) {
            if (source.hasOwnProperty(key)) {
                propertyNames.add(key);
            }
        }
    }
    else {
        // The type is a custom type, get all (assigned) property names from the destination (which does not have the jsonProperty attribute)
        for (const key in destination) {
            if (destination.hasOwnProperty(key)) {
                propertyNames.add(key);
            }
        }
    }

    for (const propertyName of Array.from(propertyNames)) {
        const propertyMetadata = getPropertyMetadata(destination, propertyName);
        if (propertyMetadata) {
            destination[propertyName] = getValue(source, destination, propertyName, propertyMetadata);
        } else if (source[propertyName] !== undefined) {
            destination[propertyName] = source[propertyName];
        }
    }

    return destination;
}

function getValue<T>(source: any, destination: T, key: string, propertyMetadata: JsonMetadata) {
    let propertyName = propertyMetadata.name ?? key;
    let propertyType = getPropertyType(destination, key);
    const fromJsonConverter = propertyMetadata.converter?.fromJson ? propertyMetadata.converter : undefined;

    if (isArray(propertyType)) {
        const type = propertyMetadata.type;

        if (fromJsonConverter) {
            if (isArray(source[propertyName])) {
                return source[propertyName].map((item: any) => runConverter(fromJsonConverter, item));
            }
            else {
                return runConverter(fromJsonConverter, source[propertyName]);
            }
        }
        else if (type) {
            if (isArray(source[propertyName])) {
                return source[propertyName].map((item: any) => modelBind(type, item));
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
};

function runConverter(converter: JsonConverter, source: any) {
    if (source === null || source === undefined) {
        return source;
    }
    return converter.fromJson!(source);
}

function getPropertyType(destination: any, propertyKey: string) {
    let target = Object.getPrototypeOf(destination);
    while (target !== Object.prototype) {
        const propertyType = Reflect.getOwnMetadata("design:type", target, propertyKey);
        if (propertyType) {
            return propertyType;
        }
        target = Object.getPrototypeOf(target);
    }
}

function isArray(object: any) {
    if (object === Array) {
        return true;
    } else if (typeof Array.isArray === "function") {
        return Array.isArray(object);
    }
    else {
        return object instanceof Array;
    }
}

function isPrimitive(object: any) {
    switch (typeof object) {
        case "string":
        case "number":
        case "boolean":
            return true;
    }
    return (
        object instanceof String || object === String ||
        object instanceof Number || object === Number ||
        object instanceof Boolean || object === Boolean
    );
}