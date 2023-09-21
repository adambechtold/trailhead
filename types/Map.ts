import shortHash from "short-hash";
import { Pin } from "./Vector";

type MapFormatVersion = "0.1";

export type Map = {
  url: string;
  key: string;
  start?: Pin;
  end?: Pin;
  formatVersion: MapFormatVersion;
};

export function generateMapKey(url: string): string {
  return shortHash(url);
}

export function generatePinKey(map: Map, name: string): string {
  return `${map.key}-${name}`;
}

export function isMap(obj: any): boolean {
  return (
    obj &&
    typeof obj.url === "string" &&
    typeof obj.key === "string" &&
    typeof obj.formatVersion === "string"
  );
}

export function createMapFromUrl(url: string): Map {
  return {
    url,
    key: generateMapKey(url),
    formatVersion: version1,
  };
}

const version1: MapFormatVersion = "0.1"; // it's not clear why we need to make this a variable, but it's the only way to get the type to be inferred correctly
export const EXAMPLE_MAPS: Map[] = [
  "/images/trailmap-timberlands-precise-1.jpeg",
  "/images/trailmap-timberlands-precise-2.jpeg",
].map((url) => createMapFromUrl(url));
