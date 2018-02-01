import { encode } from "base64-arraybuffer";
export function serialize(source) {
    return JSON.stringify(source, (key, value) => {
        if (value instanceof ArrayBuffer) {
            return encode(value);
        }
        return value;
    });
}
//# sourceMappingURL=serialize.js.map