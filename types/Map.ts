import shortHash from "short-hash";
import { Pin } from "./Vector";

export type Map = {
  url: string;
  key: string;
  start?: Pin;
  end?: Pin;
};

export function generateMapKey(url: string): string {
  return shortHash(url);
}

export function generatePinKey(map: Map, name: string): string {
  return `${map.key}-${name}`;
}

export const EXAMPLE_MAPS: Map[] = [
  { url: "/images/trailmap-timberlands-precise-1.jpeg" },
  { url: "/images/trail-map-smaller.jpeg" },
  { url: "/images/bartlett-neighborhood.jpeg" },
  { url: "/images/bartlett-closeup.jpeg" },
].map((map) => ({ ...map, key: generateMapKey(map.url) }));
