import { JsonMetadata, METADATA_KEY } from './json-metadata';

export function deserialize<T>(type: { new(): T }, source: any) {
    if (source === undefined) {
        return undefined;
    }
    if (source === null) {
        return null;
    }
    let destination = new type();

    for (let key in destination) {
        let propertyMetadata: JsonMetadata<T> = getJsonPropertyMetadata<T>(destination, key);
        if (propertyMetadata) {
            destination[key] = getValue(source, destination, key, propertyMetadata);
        } else {
            if (source[key] !== undefined) {
                destination[key] = source[key];
            }
        }
    }

    return destination;
}

export function deserializeArray<T>(type: { new(): T }, source: any[]) {
    return source.map(x =>deserialize(type, x));
}

const isPrimitive = (object: any) => {
    switch (typeof object) {
        case "string":
        case "number":
        case "boolean":
            return true;
    }
    return !!(
        object instanceof String || object === String ||
        object instanceof Number || object === Number ||
        object instanceof Boolean || object === Boolean
    );
}

const isArray = (object: any) => {
    if (object === Array) {
        return true;
    } else if (typeof Array.isArray === "function") {
        return Array.isArray(object);
    }
    else {
        return !!(object instanceof Array);
    }
}

const getJsonPropertyMetadata = <T>(target: any, propertyKey: string): JsonMetadata<T> =>
    Reflect.getOwnMetadata(METADATA_KEY, Object.getPrototypeOf(target), propertyKey);

const getValue = <T>(source: any, destination: T, key: string, propertyMetadata: JsonMetadata<T>) => {
    let propertyName = propertyMetadata.name || key;
    let type = getType(destination, key);
    const propertyMetadataCtor = propertyMetadata.ctor;
    const propertyMetadataType = propertyMetadata.type;
    
    if (isArray(type)) {

        if (propertyMetadataCtor) {
            if (isArray(source[propertyName])) {
                return source[propertyName].map((item: any) => propertyMetadataCtor(item));
            }
            else {
                return propertyMetadataCtor(source[propertyName]);
            }
        }
        else if (propertyMetadataType) {
            if (isArray(source[propertyName])) {
                return source[propertyName].map((item: any) => deserialize(propertyMetadataType, item));
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

const getType = (target: any, propertyKey: string): any =>
    Reflect.getOwnMetadata("design:type", Object.getPrototypeOf(target), propertyKey);