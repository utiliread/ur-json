import { getPropertyMetadata, getPropertyNames } from './json-property';

import { JsonMetadata } from './json-metadata';
import { decode } from 'base64-arraybuffer';

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
    const fromJson = propertyMetadata.converter ? propertyMetadata.converter.fromJson : undefined;

    if (isArray(propertyType)) {
        const type = propertyMetadata.type;

        if (fromJson) {
            if (isArray(source[propertyName])) {
                return source[propertyName].map((item: any) => fromJson(item));
            }
            else {
                return fromJson(source[propertyName]);
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
};

function getPropertyType(target: any, propertyKey: string) {
    return Reflect.getOwnMetadata("design:type", Object.getPrototypeOf(target), propertyKey);
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