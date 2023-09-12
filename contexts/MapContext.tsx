import React, { createContext, useReducer } from "react";
import { Pin } from "@/types/Vector";
import { mapContextReducer, INITIAL_STATE, MAPS } from "./mapContextReducer";
import { MapPosition } from "@/types/MapPosition";

type ThemeContextProviderProps = {
  children: React.ReactNode;
};

type MapContext = {
  mapURL: string;
  nextMap: () => void;
  start?: Pin;
  end?: Pin;
  addPin: (pin: Pin) => void;
  resetPins: () => void;
  mapPosition?: MapPosition;
  setMapPosition: (mapPosition: MapPosition) => void;
};

export const MapContext = createContext<MapContext | null>(null);

export default function MapContextProvider({
  children,
}: ThemeContextProviderProps) {
  // ====== STATE ======
  const [mapContextState, mapContextDispatch] = useReducer(
    mapContextReducer,
    INITIAL_STATE
  );

  // PINS FROM STORAGE (search for this in other files)
  // TODO: Initialize pins from local storage
  // useEffect(() => {
  //   const pinsFromStorage = JSON.parse(localStorage.getItem("pins"));
  //   if (pinsFromStorage) {
  //     setPins(pinsFromStorage);
  //   }
  // }, []);

  const mapURL = MAPS[mapContextState.mapIndex];
  const { start, end, mapPosition } = mapContextState;

  // ====== ACTIONS ======
  const nextMap = () => {
    mapContextDispatch({ type: "NEXT_MAP" });
  };

  const addPin = (pin: Pin) =>
    mapContextDispatch({ type: "ADD_PIN", payload: pin });
  const resetPins = () => mapContextDispatch({ type: "RESET_PINS" });

  const setMapPosition = (mapPosition: MapPosition) =>
    mapContextDispatch({ type: "SET_MAP_POSITION", payload: mapPosition });

  return (
    <MapContext.Provider
      value={{
        mapURL,
        nextMap,
        start,
        end,
        addPin,
        resetPins,
        mapPosition,
        setMapPosition,
      }}
    >
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
