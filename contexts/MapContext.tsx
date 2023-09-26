import React, { createContext, useReducer, useEffect, useContext } from "react";
import { Pin } from "@/types/Vector";
import { mapContextReducer, INITIAL_STATE } from "./mapContextReducer";
import { MapPosition } from "@/types/MapPosition";
import { Map, generatePinKey } from "@/types/Map";
import { MapStorageManager } from "@/types/MapStorageManager";

type MapContextProviderProps = {
  children: React.ReactNode;
};

type MapContext = {
  map: Map;
  mapList: Map[];
  addMap: (map: Map) => boolean;
  deleteMap: (mapKey: string) => void;
  chooseMap: (mapKey: string) => void;
  downloadMap: (mapKey: string) => void;
  setStartPin: (map: Map, pin: Pin) => void;
  setEndPin: (map: Map, pin: Pin) => void;
  deleteStartPin: (map: Map) => void;
  deleteEndPin: (map: Map) => void;
  resetPins: (map: Map) => void;
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

  const mapStorage = new MapStorageManager("LOCAL_STORAGE");

  /* Load Pins for Map
  useEffect(() => {
    if (!mapContextState.mapList.length) return;
    const currentMap: Map = mapContextState.mapList[mapContextState.mapIndex];

    if (startFromStorage) {
      const start = JSON.parse(startFromStorage);
      mapContextDispatch({ type: "SET_START", payload: start });
    }
    if (endFromStorage) {
      const end = JSON.parse(endFromStorage);
      mapContextDispatch({ type: "SET_END", payload: end });
    }
  }, [mapContextState.mapIndex]);
  */

  // ========= Load Saved Maps ==============
  useEffect(() => {
    mapStorage
      .getMaps()
      .then((maps) => {
        console.log("load the maps", maps);
        mapContextDispatch({ type: "SET_MAPS", payload: maps });
      })
      .catch((err) => {
        console.error("load saved maps error", err);
      });
  }, []);

  const currentMap = mapContextState.mapList[mapContextState.mapIndex];
  const { mapPosition: currentMapPosition, mapList: currentMapList } =
    mapContextState;

  // ====== ACTIONS ======
  const addMap = (map: Map): boolean => {
    const mapAlreadyExists =
      currentMapList.filter((savedMap) => savedMap.key === map.key).length > 0;
    if (mapAlreadyExists) {
      // if this map already exists
      const result = confirm(
        "You already have a map based on the same image. Continuing will overwrite it."
      );
      if (!result) return false;
      mapContextDispatch({ type: "OVERWRITE_MAP", payload: map });
      mapStorage.putMap(map);
    }
    mapStorage.putMap(map); // TODO: should this be "add" instead of "put"? I used put because the mapAlreadyExists doesn't check saved maps
    mapContextDispatch({ type: "ADD_NEW_MAP", payload: map });
    return true;
  };

  const deleteMap = (mapKey: string) => {
    mapContextDispatch({ type: "DELETE_MAP", payload: mapKey });
    mapStorage.deleteMapByKey(mapKey);
  };

  const chooseMap = (mapKey: string) => {
    const mapIndex = currentMapList.findIndex((map) => map.key === mapKey);
    mapContextDispatch({ type: "CHOOSE_MAP", payload: mapIndex });
  };

  const downloadMap = (mapKey: string) => {
    const map = currentMapList.find((map) => map.key === mapKey);
    if (!map) return;

    const json = JSON.stringify(map);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.download = `map-${mapKey}.json`;
    link.href = url;
    link.click();
  };

  const setMapPosition = (mapPosition: MapPosition) =>
    mapContextDispatch({ type: "SET_MAP_POSITION", payload: mapPosition });

  const removeMapError = () => mapContextDispatch({ type: "REMOVE_MAP_ERROR" });

  const addPinToMap = (map: Map, pin: Pin, type: "start" | "end") => {
    map[type] = pin;
    mapContextDispatch({
      type: "OVERWRITE_MAP",
      payload: map,
    });
    mapStorage.putMap(map);
  };

  const deletePinFromMap = (map: Map, type: "start" | "end") => {
    delete map[type];
    mapContextDispatch({
      type: "OVERWRITE_MAP",
      payload: map,
    });
    mapStorage.putMap(map);
  };

  const resetPins = (map: Map) => {
    deletePinFromMap(map, "start");
    deletePinFromMap(map, "end");
    mapContextDispatch({
      type: "OVERWRITE_MAP",
      payload: map,
    });
    mapStorage.putMap(map);
  };

  return (
    <MapContext.Provider
      value={{
        map: currentMap,
        mapList: currentMapList,
        addMap,
        deleteMap,
        chooseMap,
        downloadMap,
        setStartPin: (map: Map, pin: Pin) => addPinToMap(map, pin, "start"),
        setEndPin: (map: Map, pin: Pin) => addPinToMap(map, pin, "end"),
        deleteStartPin: (map: Map) => deletePinFromMap(map, "start"),
        deleteEndPin: (map: Map) => deletePinFromMap(map, "end"),
        resetPins,
        mapPosition: currentMapPosition,
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
