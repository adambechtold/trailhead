import { MapPosition } from "@/types/MapPosition";
import { Map } from "@/types/Map";

export type MapContextState = {
  mapIndex: number;
  mapList: Map[];
  mapPosition?: MapPosition;
  mapSaveError: boolean;
};

export type Action =
  | { type: "ADD_NEW_MAP"; payload: Map }
  | { type: "SET_MAPS"; payload: Map[] }
  | { type: "OVERWRITE_MAP"; payload: Map }
  | { type: "DELETE_MAP"; payload: string }
  | { type: "CHOOSE_MAP"; payload: number }
  | { type: "SET_MAP_POSITION"; payload: MapPosition }
  | { type: "REMOVE_MAP_ERROR" };

export const INITIAL_STATE: MapContextState = {
  mapIndex: 0,
  mapList: [],
  mapPosition: {
    x: 0,
    y: 0,
    scale: 0.4, // TODO: Calculate This from the image size
  },
  mapSaveError: false,
};

export const mapContextReducer = (state: MapContextState, action: Action) => {
  const currentMap = state.mapList[state.mapIndex];
  let newMap: Map = { ...currentMap };
  let newMapList: Map[] = [...state.mapList];

  switch (action.type) {
    case "ADD_NEW_MAP":
      const mapToAdd = action.payload;
      const existingMap = state.mapList.find((map) => map.key === mapToAdd.key);
      if (existingMap) return state;
      newMapList.splice(state.mapIndex, 0, mapToAdd);
      return {
        ...state,
        mapList: newMapList,
        mapSaveError: false,
      };
    case "SET_MAPS":
      const mapsToLoad = action.payload;
      return {
        ...state,
        mapList: mapsToLoad,
      };
    case "DELETE_MAP":
      const key: string = action.payload;
      const indexToDelete: number = newMapList.findIndex(
        (map) => map.key === key
      );
      if (indexToDelete === -1) return state;
      newMapList.splice(indexToDelete, 1);
      const newIndex = indexToDelete === 0 ? 0 : indexToDelete - 1;
      return {
        ...state,
        mapList: newMapList,
        mapIndex: newIndex,
      };
    case "OVERWRITE_MAP":
      newMap = action.payload;
      const indexOfNewMap = newMapList.findIndex(
        (map) => map.key === newMap.key
      );
      if (indexOfNewMap === -1) return state;
      newMapList[indexOfNewMap] = newMap;
      return {
        ...state,
        mapList: newMapList,
      };
    case "CHOOSE_MAP":
      return {
        ...state,
        mapIndex: action.payload,
      };
    case "SET_MAP_POSITION":
      return {
        ...state,
        mapPosition: action.payload,
      };
    case "REMOVE_MAP_ERROR":
      return {
        ...state,
        mapSaveError: false,
      };
    default:
      return state;
  }
};
