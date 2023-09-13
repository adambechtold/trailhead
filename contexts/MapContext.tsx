import React, { createContext, useReducer, useEffect, useContext } from "react";
import { Pin } from "@/types/Vector";
import { mapContextReducer, INITIAL_STATE } from "./mapContextReducer";
import { MapPosition } from "@/types/MapPosition";

type MapContextProviderProps = {
  children: React.ReactNode;
};

type MapContext = {
  mapURL: string;
  addMap: (mapURL: string) => void;
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
}: MapContextProviderProps) {
  // ====== STATE ======
  const [mapContextState, mapContextDispatch] = useReducer(
    mapContextReducer,
    INITIAL_STATE
  );

  // PINS FROM STORAGE (search for this in other files)
  useEffect(() => {
    const startFromStorage = localStorage.getItem("start");
    const endFromStorage = localStorage.getItem("end");

    if (startFromStorage) {
      const start = JSON.parse(startFromStorage);
      mapContextDispatch({ type: "SET_START", payload: start });
    }
    if (endFromStorage) {
      const end = JSON.parse(endFromStorage);
      mapContextDispatch({ type: "SET_END", payload: end });
    }
  }, []);

  const mapURL = mapContextState.mapList[mapContextState.mapIndex];
  const { start, end, mapPosition } = mapContextState;

  // ====== ACTIONS ======
  const addMap = (mapURL: string) => {
    mapContextDispatch({ type: "ADD_MAP", payload: mapURL });
    mapContextDispatch({ type: "RESET_PINS" });
  };

  const nextMap = () => {
    mapContextDispatch({ type: "NEXT_MAP" });
    mapContextDispatch({ type: "RESET_PINS" });
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
        addMap,
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
  const context = useContext(MapContext);
  if (!context) {
    throw new Error("useMapContext must be used within a MapContextProvider");
  }
  return context;
}
