import { deserialize } from './deserialize';
import { extend } from 'lodash';

export interface Page {
    number: number;
    size: number;
}

export interface PaginationResult<T> {
    meta: {
        pageCount: number;
        pageSize: number;
        totalItems: number;
    },
    data: T[];
}

export function paginationFactory<T>(itemTypeOrFactory: { new (): T } | ((item: any) => T), source: any): PaginationResult<T> {
    const itemFactory = isClass(itemTypeOrFactory) ? (x: any) => deserialize(itemTypeOrFactory, x) : itemTypeOrFactory;
    return extend(source, {
        data: source.data.map(itemFactory)
    });
}

function isClass<T>(itemTypeOrFactory: { new (): T } | ((item: any) => T)): itemTypeOrFactory is { new (): T } {
    return typeof itemTypeOrFactory === 'function' && /^\s*class\s+/.test(itemTypeOrFactory.toString());
}