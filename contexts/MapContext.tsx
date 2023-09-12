import React, { createContext, useState } from "react";

type ThemeContextProviderProps = {
  children: React.ReactNode;
};

type MapContext = {
  mapURL: string;
  nextMap: () => void;
};

const MAPS = [
  "/images/trailmap-timberlands-precise-1.jpeg",
  "/images/trail-map-smaller.jpeg",
  "/images/bartlett-neighborhood.jpeg",
  "/images/bartlett-closeup.jpeg",
];

export const MapContext = createContext<MapContext | null>(null);

export default function MapContextProvider({
  children,
}: ThemeContextProviderProps) {
  const [mapIndex, setMapIndex] = useState(0);

  const nextMap = () => {
    setMapIndex((mapIndex + 1) % MAPS.length);
  };

  console.log("MapContextProvider", { mapIndex, mapURL: MAPS[mapIndex] });

  return (
    <MapContext.Provider value={{ mapURL: MAPS[mapIndex], nextMap }}>
      {children}
    </MapContext.Provider>
  );
}

export function useMapContext() {
  const context = React.useContext(MapContext);
  if (!context) {
    throw new Error("useMapContext must be used within a MapContextProvider");
  }
  return context;
}
