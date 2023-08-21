import { JsonMetadata } from "./json-metadata";

const PROPERTY_METADATA_KEY = "jsonProperty";
const PROPERTY_NAMES_METADATA_KEY = "jsonPropertyNames";

/**
 * Attribute specifying a property to be serialized
 * @param nameOrMetadata The name of the json property or metadata describing how to construct the property
 */
export function jsonProperty(nameOrMetadata?: string | JsonMetadata) {
  let metadata: JsonMetadata = {};

  if (typeof nameOrMetadata === "string") {
    metadata.name = nameOrMetadata;
  } else if (nameOrMetadata) {
    metadata = nameOrMetadata;
  }

  if (!!metadata.type && !!metadata.converter) {
    throw "Only one of type or converter can be specified";
  }

  return function (target: Object, propertyKey: string) {
    const propertyNames =
      Reflect.getOwnMetadata(PROPERTY_NAMES_METADATA_KEY, target) || [];

    propertyNames.push(propertyKey);
    Reflect.defineMetadata(PROPERTY_NAMES_METADATA_KEY, propertyNames, target);
    Reflect.defineMetadata(
      PROPERTY_METADATA_KEY,
      metadata,
      target,
      propertyKey
    );
  };
}

export function getPropertyMetadata(
  instance: any,
  propertyKey: string
): JsonMetadata | undefined {
  let target = Object.getPrototypeOf(instance);
  while (target !== Object.prototype) {
    const metadata = Reflect.getOwnMetadata(
      PROPERTY_METADATA_KEY,
      target,
      propertyKey
    );
    if (metadata) {
      return metadata;
    }
    target = Object.getPrototypeOf(target);
  }
}

export function getPropertyNames(instance: any): string[] {
  const names: string[] = [];
  let target = Object.getPrototypeOf(instance);
  while (target !== Object.prototype) {
    const propertyNames = Reflect.getOwnMetadata(
      PROPERTY_NAMES_METADATA_KEY,
      target
    );
    if (propertyNames) {
      names.push(...propertyNames);
    }
    target = Object.getPrototypeOf(target); // Set target to base class
  }
  return names;
}
