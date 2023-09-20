import React, { createContext, useReducer, useEffect, useContext } from "react";
import { Pin } from "@/types/Vector";
import { mapContextReducer, INITIAL_STATE } from "./mapContextReducer";
import { MapPosition } from "@/types/MapPosition";
import { Map, generatePinKey } from "@/types/Map";

type MapContextProviderProps = {
  children: React.ReactNode;
};

type MapContext = {
  map: Map;
  mapList: Map[];
  addMap: (mapURL: string) => void;
  deleteMap: (mapKey: string) => void;
  chooseMap: (mapKey: string) => void;
  setStartPin: (map: Map, pin: Pin) => void;
  setEndPin: (map: Map, pin: Pin) => void;
  resetPins: () => void;
  mapPosition?: MapPosition;
  setMapPosition: (mapPosition: MapPosition) => void;
  mapSaveError: boolean;
  removeMapError: () => void;
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

  // Load Pins for Map
  useEffect(() => {
    if (!mapContextState.mapList.length) return;
    const currentMap: Map = mapContextState.mapList[mapContextState.mapIndex];

    const startFromStorage = localStorage.getItem(
      generatePinKey(currentMap, "start")
    );
    const endFromStorage = localStorage.getItem(
      generatePinKey(currentMap, "end")
    );

    if (startFromStorage) {
      const start = JSON.parse(startFromStorage);
      mapContextDispatch({ type: "SET_START", payload: start });
    }
    if (endFromStorage) {
      const end = JSON.parse(endFromStorage);
      mapContextDispatch({ type: "SET_END", payload: end });
    }
  }, [mapContextState.mapIndex]);

  useEffect(() => {
    // ========= Load Saved Maps ==============
    const result = localStorage.getItem("savedMapKeys");
    const savedMapKeys = result ? JSON.parse(result) : [];

    for (const mapKey of savedMapKeys) {
      mapContextDispatch({ type: "LOAD_SAVED_MAP", payload: mapKey });
    }
  }, []);

  const map = mapContextState.mapList[mapContextState.mapIndex];
  const { mapPosition, mapList } = mapContextState;

  // ====== ACTIONS ======
  const addMap = (mapURL: string) => {
    mapContextDispatch({ type: "ADD_NEW_MAP", payload: mapURL });
  };

  const deleteMap = (mapKey: string) => {
    mapContextDispatch({ type: "DELETE_MAP", payload: mapKey });
  };

  const chooseMap = (mapKey: string) => {
    const mapIndex = mapList.findIndex((map) => map.key === mapKey);
    mapContextDispatch({ type: "CHOOSE_MAP", payload: mapIndex });
  };

  const resetPins = () => mapContextDispatch({ type: "RESET_PINS" });

  const setMapPosition = (mapPosition: MapPosition) =>
    mapContextDispatch({ type: "SET_MAP_POSITION", payload: mapPosition });

  const removeMapError = () => mapContextDispatch({ type: "REMOVE_MAP_ERROR" });

  const setStartPin = (map: Map, pin: Pin) => {
    mapContextDispatch({
      type: "SET_START",
      payload: {
        map,
        pin,
      },
    });
  };

  const setEndPin = (map: Map, pin: Pin) => {
    mapContextDispatch({
      type: "SET_END",
      payload: {
        map,
        pin,
      },
    });
  };

  return (
    <MapContext.Provider
      value={{
        map,
        mapList,
        addMap,
        deleteMap,
        chooseMap,
        setStartPin,
        setEndPin,
        resetPins,
        mapPosition,
        setMapPosition,
        mapSaveError: mapContextState.mapSaveError,
        removeMapError,
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
