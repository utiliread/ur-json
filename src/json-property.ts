import { JsonMetadata } from "./json-metadata";

const PROPERTY_METADATA_KEY = Symbol("Symbol.jsonProperty");
const PROPERTY_NAMES_METADATA_KEY = Symbol("Symbol.jsonPropertyNames");

// See https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-2.html#decorator-metadata
const typePropertyNames = new Map<DecoratorMetadataObject, string[]>();

/**
 * Attribute specifying a property to be serialized
 * @param nameOrMetadata The name of the json property or metadata describing how to construct the property
 */
export function jsonProperty<Target>(): (
  target: Target,
  contextOrPropertyKey: ClassFieldDecoratorContext | string,
  descriptor?: PropertyDescriptor,
) => void;
export function jsonProperty<Target>(
  name: string,
): (
  target: Target,
  contextOrPropertyKey: ClassFieldDecoratorContext | string,
  descriptor?: PropertyDescriptor,
) => void;
export function jsonProperty<Target>(
  metadata: JsonMetadata,
): (
  target: Target,
  contextOrPropertyKey: ClassFieldDecoratorContext | string,
  descriptor?: PropertyDescriptor,
) => void;

export function jsonProperty<Target>(nameOrMetadata?: string | JsonMetadata) {
  let metadata: JsonMetadata = {};
  if (typeof nameOrMetadata === "string") {
    metadata.name = nameOrMetadata;
  } else if (nameOrMetadata) {
    metadata = nameOrMetadata;
  }

  if (!!metadata.type && !!metadata.converter) {
    throw "Only one of type or converter can be specified";
  }

  return function (
    target: Target,
    contextOrPropertyKey: ClassFieldDecoratorContext | string,
  ) {
    if (typeof contextOrPropertyKey === "string") {
      // Typescript legacy experimental decorators

      const propertyKey = contextOrPropertyKey;
      const targetObj = target as Object;
      const propertyNames =
        Reflect.getOwnMetadata(PROPERTY_NAMES_METADATA_KEY, targetObj) || [];

      propertyNames.push(propertyKey);
      Reflect.defineMetadata(
        PROPERTY_NAMES_METADATA_KEY,
        propertyNames,
        targetObj,
      );
      Reflect.defineMetadata(
        PROPERTY_METADATA_KEY,
        metadata,
        targetObj,
        propertyKey,
      );
    } else {
      // Typescript 5

      const context = contextOrPropertyKey;

      if (typeof context.name !== "string") {
        throw new Error("Can only serialize string properties.");
      }

      if (context.static || context.private) {
        throw new Error(
          `[${context.name}] Can only serialize public instance members.`,
        );
      }

      if (context.metadata === undefined) {
        throw new Error(
          "Context metadata not available. Is Symbol.metadata defined?",
        );
      }

      // context.metadata is shared for the class to which the property we are decorating belongs
      let propertyNames = typePropertyNames.get(context.metadata);
      if (propertyNames === undefined) {
        typePropertyNames.set(context.metadata, (propertyNames = []));
      }
      propertyNames.push(context.name);

      const propertyMetadata: any = (context.metadata[PROPERTY_METADATA_KEY] ??=
        {});
      propertyMetadata[context.name] = metadata;
    }
  };
}

export function getPropertyMetadata(
  instance: any,
  propertyKey: string,
): JsonMetadata | undefined {
  let target = Object.getPrototypeOf(instance);
  while (target !== Object.prototype) {
    let metadata = target.constructor?.[Symbol.metadata];
    if (
      metadata &&
      metadata[PROPERTY_METADATA_KEY] &&
      metadata[PROPERTY_METADATA_KEY][propertyKey]
    ) {
      return metadata[PROPERTY_METADATA_KEY][propertyKey];
    }

    metadata = Reflect.getOwnMetadata(
      PROPERTY_METADATA_KEY,
      target,
      propertyKey,
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
    const metadata = target.constructor?.[Symbol.metadata];
    let propertyNames = metadata && typePropertyNames.get(metadata);
    if (propertyNames) {
      names.push(...propertyNames);
    }

    propertyNames = Reflect.getOwnMetadata(PROPERTY_NAMES_METADATA_KEY, target);
    if (propertyNames) {
      names.push(...propertyNames);
    }

    target = Object.getPrototypeOf(target); // Set target to base class
  }
  return names;
}
