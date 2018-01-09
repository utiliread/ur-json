"use strict";
import { deserialize } from './deserialize';
import { extend } from 'lodash';
export function paginationFactory(itemTypeOrFactory, source) {
    const itemFactory = isClass(itemTypeOrFactory) ? (x) => deserialize(itemTypeOrFactory, x) : itemTypeOrFactory;
    return extend(source, {
        data: source.data.map(itemFactory)
    });
}
function isClass(itemTypeOrFactory) {
    return typeof itemTypeOrFactory === 'function' && /^\s*class\s+/.test(itemTypeOrFactory.toString());
}
