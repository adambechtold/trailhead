import React, { createContext, useReducer } from "react";
import {
  mapContextReducer,
  INITIAL_STATE,
  MAPS,
  MapContextState,
} from "./mapContextReducer";

type ThemeContextProviderProps = {
  children: React.ReactNode;
};

type MapContext = {
  mapURL: string;
  nextMap: () => void;
};

export const MapContext = createContext<MapContext | null>(null);

export default function MapContextProvider({
  children,
}: ThemeContextProviderProps) {
  const [mapContextState, mapContextDispatch] = useReducer(
    mapContextReducer,
    INITIAL_STATE
  );

  const nextMap = () => {
    mapContextDispatch({ type: "NEXT_MAP" });
  };

  const mapURL = MAPS[mapContextState.mapIndex];

  return (
    <MapContext.Provider value={{ mapURL, nextMap }}>
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
