import { getPropertyMetadata, getPropertyNames } from "./json-property";

import { JsonConverter } from "./json-converter";
import { JsonMetadata } from "./json-metadata";
import { decode } from "base64-arraybuffer";

export function deserializeString<T>(
  json: string,
  type: { new (): T }
): T | null | undefined {
  return deserialize(JSON.parse(json), type);
}

export function deserialize<T>(
  source: any,
  type: { new (): T }
): T | null | undefined {
  if (source === undefined) {
    return source;
  }

  if (
    source === null ||
    type.prototype === Array.prototype ||
    type.prototype === String.prototype
  ) {
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
  } else {
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
      destination[propertyName] = getValue(
        source,
        destination,
        propertyName,
        propertyMetadata
      );
    } else if (source[propertyName] !== undefined) {
      destination[propertyName] = source[propertyName];
    }
  }

  return destination;
}

function getValue<T>(
  source: any,
  destination: T,
  key: string,
  propertyMetadata: JsonMetadata
) {
  const propertyName = propertyMetadata.name ?? key;
  const propertyType = getPropertyType(destination, key);
  const fromJsonConverter = propertyMetadata.converter?.fromJson
    ? propertyMetadata.converter
    : undefined;

  if (isArray(propertyType)) {
    const type = propertyMetadata.type;

    if (fromJsonConverter) {
      if (isArray(source[propertyName])) {
        return source[propertyName].map((item: any) =>
          runConverter(fromJsonConverter, item)
        );
      } else {
        return runConverter(fromJsonConverter, source[propertyName]);
      }
    } else if (type) {
      if (isArray(source[propertyName])) {
        return source[propertyName].map((item: any) => deserialize(item, type));
      } else {
        return undefined;
      }
    }
  }

  if (fromJsonConverter) {
    return runConverter(fromJsonConverter, source[propertyName]);
  } else if (propertyType === ArrayBuffer) {
    const value = source[propertyName];
    if (typeof value === "string") {
      return decode(value);
    } else {
      return value; // null or undefined;
    }
  } else if (!isPrimitive(propertyType)) {
    return deserialize(source[propertyName], propertyType);
  } else {
    return source[propertyName];
  }
}

function runConverter(converter: JsonConverter, source: any) {
  if (
    (source === null && !converter.handleNull) ||
    (source === undefined && !converter.handleUndefined)
  ) {
    return source;
  }
  return converter.fromJson!(source);
}

function getPropertyType(destination: any, propertyKey: string) {
  let target = Object.getPrototypeOf(destination);
  while (target !== Object.prototype) {
    const propertyType = Reflect.getOwnMetadata(
      "design:type",
      target,
      propertyKey
    );
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
  } else {
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
    object instanceof String ||
    object === String ||
    object instanceof Number ||
    object === Number ||
    object instanceof Boolean ||
    object === Boolean
  );
}
