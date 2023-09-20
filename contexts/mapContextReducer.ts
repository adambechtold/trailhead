import { MapPosition } from "@/types/MapPosition";
import { Pin } from "@/types/Vector";
import { Map, generateMapKey, generatePinKey } from "@/types/Map";

export type MapContextState = {
  mapIndex: number;
  mapList: Map[];
  mapPosition?: MapPosition;
  mapSaveError: boolean;
};

export type Action =
  | { type: "ADD_NEW_MAP"; payload: string }
  | { type: "LOAD_SAVED_MAP"; payload: string }
  | { type: "DELETE_MAP"; payload: string }
  | { type: "CHOOSE_MAP"; payload: number }
  | { type: "ADD_PIN"; payload: { pin: Pin; index: number } }
  | { type: "RESET_PINS" }
  | { type: "SET_MAP_POSITION"; payload: MapPosition }
  | { type: "SET_START"; payload: Pin }
  | { type: "SET_END"; payload: Pin }
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
      const newMapURL = action.payload;
      const newMapKey = generateMapKey(newMapURL);
      const existingMap = state.mapList.find((map) => map.key === newMapKey);
      if (existingMap) return state;
      newMap = {
        url: newMapURL,
        key: generateMapKey(newMapURL),
      };
      newMapList.splice(state.mapIndex, 0, newMap);
      if (localStorage.getItem(newMap.key) === null) {
        const saveWasSuccessful = saveMap(newMap);
        if (!saveWasSuccessful) {
          newMapList.splice(state.mapIndex, 1);
          return {
            ...state,
            mapSaveError: true,
          };
        }
      }
      return {
        ...state,
        mapList: newMapList,
        mapSaveError: false,
      };
    case "LOAD_SAVED_MAP":
      const savedMapKey = action.payload;
      const savedMap = JSON.parse(localStorage.getItem(savedMapKey) || "");
      if (!savedMap) return state;
      const alreadyLoaded = !!state.mapList.find(
        (map) => map.key === savedMapKey
      );
      if (alreadyLoaded) return state;
      newMapList.push(savedMap);
      return {
        ...state,
        mapList: newMapList,
      };
    case "DELETE_MAP":
      const key: string = action.payload;
      const indexToDelete: number = newMapList.findIndex(
        (map) => map.key === key
      );
      if (indexToDelete === -1) return state;
      deleteMap(newMapList[indexToDelete]);
      newMapList.splice(indexToDelete, 1);
      const newIndex = indexToDelete === 0 ? 0 : indexToDelete - 1;
      return {
        ...state,
        mapList: newMapList,
        mapIndex: newIndex,
      };
    case "CHOOSE_MAP":
      return {
        ...state,
        mapIndex: action.payload,
      };
    case "ADD_PIN":
      const { pin, index } = action.payload;
      return addPin(state, pin, index);
    case "SET_START":
      savePin(generatePinKey(currentMap, "start"), action.payload);
      currentMap.start = action.payload;
      newMapList[state.mapIndex] = newMap;
      return {
        ...state,
        mapList: newMapList,
      };
    case "SET_END":
      savePin(generatePinKey(currentMap, "end"), action.payload);
      newMap = { ...currentMap };
      newMap.end = action.payload;
      newMapList = [...state.mapList];
      newMapList[state.mapIndex] = newMap;
      return {
        ...state,
        mapList: newMapList,
      };
    case "RESET_PINS":
      const newState = { ...state };
      delete newState.mapList[state.mapIndex].start;
      delete newState.mapList[state.mapIndex].end;

      localStorage.removeItem(generatePinKey(currentMap, "start"));
      localStorage.removeItem(generatePinKey(currentMap, "end"));
      return newState;
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

const addPin = (
  state: MapContextState,
  pin: Pin,
  index: number
): MapContextState => {
  const currentMap: Map = state.mapList[state.mapIndex];
  if (index > 1) return state;

  const name = index === 0 ? "start" : "end";
  const newState = { ...state };
  newState.mapList[state.mapIndex][name] = pin;
  savePin(generatePinKey(currentMap, name), pin);
  return newState;
};

const savePin = (name: string, pin: Pin) => {
  localStorage.setItem(name, JSON.stringify(pin));
};

const saveMap = (map: Map): boolean => {
  const savedMapKeys = getSavedMapList();
  const newSavedMapKeys = [...savedMapKeys, map.key];
  try {
    localStorage.setItem("savedMapKeys", JSON.stringify(newSavedMapKeys));
    localStorage.setItem(map.key, JSON.stringify(map));
    return true;
  } catch (e) {
    localStorage.setItem("savedMapKeys", JSON.stringify(savedMapKeys));
    localStorage.removeItem(map.key);
    return false;
  }
};

const deleteMap = (map: Map) => {
  const savedMapKeys = getSavedMapList();
  const indexOfMap = savedMapKeys.indexOf(map.key);
  if (indexOfMap === -1) return;
  savedMapKeys.splice(savedMapKeys.indexOf(map.key), 1);
  localStorage.setItem("savedMapKeys", JSON.stringify(savedMapKeys));
  localStorage.removeItem(map.key);
};

const getSavedMapList = (): string[] => {
  const result = localStorage.getItem("savedMapKeys");
  return result ? JSON.parse(result) : [];
};