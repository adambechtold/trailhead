import React, { createContext, useReducer, useEffect, useContext } from "react";
import { Pin } from "@/types/Vector";
import { mapContextReducer, INITIAL_STATE } from "./mapContextReducer";
import { MapPosition } from "@/types/MapPosition";
import { Map } from "@/types/Map";
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

  const mapStorage = new MapStorageManager("INDEXED_DB");

  // ========= Load Saved Maps ==============
  useEffect(() => {
    mapStorage
      .getMaps()
      .then((maps) => {
        const savedMaps = maps.map((m) => ({
          ...m,
          isSaved: true,
        }));
        mapContextDispatch({
          type: "SET_MAPS",
          payload: savedMaps,
        });
      })
      .catch((err) => {
        console.error("load saved maps error", err);
      });
  }, []);

  const currentMap = mapContextState.mapList[mapContextState.mapIndex];
  const { mapPosition: currentMapPosition, mapList: currentMapList } =
    mapContextState;

  // ====== ACTIONS ======
  function storeSavedResult(map: Map, wasSaved: boolean) {
    map.isSaved = wasSaved;
    mapContextDispatch({ type: "OVERWRITE_MAP", payload: map });
  }

  function clearSavedFromMap(map: Map): Map {
    delete map.isSaved;
    return map;
  }

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
      mapStorage
        .putMap(clearSavedFromMap(map))
        .then((wasSaved) => storeSavedResult(map, wasSaved));
      return true;
    } else {
      // TODO: should this be "add" instead of "put"? I used put because the mapAlreadyExists doesn't check saved maps
      mapStorage
        .putMap(clearSavedFromMap(map))
        .then((wasSaved) => storeSavedResult(map, wasSaved));
      mapContextDispatch({ type: "ADD_NEW_MAP", payload: map });
      return true;
    }
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
    mapStorage
      .putMap(clearSavedFromMap(map))
      .then((wasSaved) => storeSavedResult(map, wasSaved));
  };

  const deletePinFromMap = (map: Map, type: "start" | "end") => {
    delete map[type];
    mapContextDispatch({
      type: "OVERWRITE_MAP",
      payload: map,
    });
    mapStorage
      .putMap(clearSavedFromMap(map))
      .then((wasSaved) => storeSavedResult(map, wasSaved));
  };

  const resetPins = (map: Map) => {
    deletePinFromMap(map, "start");
    deletePinFromMap(map, "end");
    mapContextDispatch({
      type: "OVERWRITE_MAP",
      payload: map,
    });
    mapStorage
      .putMap(clearSavedFromMap(map))
      .then((wasSaved) => storeSavedResult(map, wasSaved));
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
