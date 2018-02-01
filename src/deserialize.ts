import { JsonMetadata } from './json-metadata';
import { decode } from 'base64-arraybuffer';
import { getPropertyMetadata } from './json-property';

export function modelBind<T>(type: { new(): T }, source: any): T | null | undefined {
    if (source === undefined || source === null) {
        return source;
    }

    let destination = new type();

    for (let key in destination) {
        let propertyMetadata = getPropertyMetadata(destination, key);
        if (propertyMetadata) {
            destination[key] = getValue(source, destination, key, propertyMetadata);
        } else if (source[key] !== undefined) {
            destination[key] = source[key];
        }
    }

    return destination;
}

function getValue<T>(source: any, destination: T, key: string, propertyMetadata: JsonMetadata) {
    let propertyName = propertyMetadata.name || key;
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