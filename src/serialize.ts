import { encode } from "base64-arraybuffer";

export function serialize(source: any) {
  return JSON.stringify(source, (key, value) => {
    if (value instanceof ArrayBuffer) {
      return encode(value);
    }
    return value;
  });
}
