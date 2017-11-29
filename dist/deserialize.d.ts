export declare function deserialize<T>(type: {
    new (): T;
}, source: any): T | null | undefined;
export declare function deserializeArray<T>(type: {
    new (): T;
}, source: any[]): (T | null | undefined)[];
