import shortHash from "short-hash";
import { Pin } from "./Vector";

type MapFormatVersion = "0.1" | "0.2";

export type Map = {
  url: string;
  key: string;
  pins?: Pin[];
  start?: Pin;
  end?: Pin;
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

export function createMapFromUrl(url: string): Map {
  return {
    url,
    key: generateMapKey(url),
    formatVersion: "0.2",
    pinScale: 1,
  };
}

export const EXAMPLE_MAPS: Map[] = [
  "/images/trailmap-timberlands-precise-1.jpeg",
  "/images/trailmap-timberlands-precise-2.jpeg",
].map((url) => createMapFromUrl(url));

export function updateToLatestVersion(maybeMap: any): Map {
  if (!isMap(maybeMap)) {
    throw new Error("Invalid map");
  }
  const map = maybeMap as Map;
  switch (map.formatVersion) {
    case "0.1":
      const { pins, start, end, ...rest } = map;
      let newPins = [];
      if (pins) newPins = pins;
      else {
        if (start) newPins.push(start);
        if (end) newPins.push(end);
      }
      return {
        ...rest,
        pins: newPins,
        formatVersion: "0.2",
      };
    case "0.2":
      return map;
    default:
      throw new Error("Invalid map format version");
  }
}
