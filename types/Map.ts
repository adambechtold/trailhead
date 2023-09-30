import shortHash from "short-hash";
import { Pin } from "./Vector";

type MapFormatVersion = "0.1" | "0.2";

export type Map = {
  url: string;
  key: string;
  pins?: Pin[];
  formatVersion: MapFormatVersion;
  isSaved?: boolean;
  pinScale?: number;
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

export function createMapFromUrl(
  url: string,
  version: MapFormatVersion = "0.2"
): Map {
  return {
    url,
    key: generateMapKey(url),
    formatVersion: version,
    pinScale: 1,
  };
}

export const EXAMPLE_MAPS: Map[] = [
  "/images/trailmap-timberlands-precise-1.jpeg",
  "/images/trailmap-timberlands-precise-2.jpeg",
].map((url) => createMapFromUrl(url, "0.2"));

export function convertToLatestVerionMap(maybeMap: any): Map {
  const start = maybeMap.start;
  const end = maybeMap.end;
  delete maybeMap.start;
  delete maybeMap.end;
  if (isMap(maybeMap)) {
    const map = maybeMap as Map;
    if (map.formatVersion === "0.1") {
      map.url = maybeMap.url;
      map.key = maybeMap.key;
      map.formatVersion = "0.2";
      map.pinScale = maybeMap.pinScale || 1;
      map.pins = [];
      if (start) {
        map.pins.push(start);
      }
      if (end) {
        map.pins.push(end);
      }
    }
    return map;
  }
  throw new Error("Invalid map");
}
