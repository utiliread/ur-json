export const METADATA_KEY = "jsonProperty";

export interface JsonMetadata<T> {
    /**
     * The name of the json property
     */
    name?: string;

    /**
     * The type used to construct the property instance
     */
    type?: { new(): T };

    /**
     * The factory function used to create the property instance
     */
    ctor?: (source: any) => T;
}