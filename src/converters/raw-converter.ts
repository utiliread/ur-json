import { JsonConverter } from "../json-converter";

class RawConverter implements JsonConverter {
  fromJson(source: any) {
    return source;
  }
}

export const rawConverter = new RawConverter();
