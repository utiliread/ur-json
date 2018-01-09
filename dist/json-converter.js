"use strict";
export class JsonConverter {
    convertArray(source) {
        return source.map(this.convert.bind(this));
    }
}
