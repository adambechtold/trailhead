import { MapPosition } from "@/types/MapPosition";
import { Pin } from "@/types/Vector";
import { Map, EXAMPLE_MAPS, generateMapKey, generatePinKey } from "@/types/Map";

export type MapContextState = {
  mapIndex: number;
  mapList: Map[];
  mapPosition?: MapPosition;
};

type Action = {
  type:
    | "ADD_MAP"
    | "CHOOSE_MAP"
    | "ADD_PIN"
    | "RESET_PINS"
    | "SET_MAP_POSITION"
    | "SET_START"
    | "SET_END";
  payload?: any;
};

export const INITIAL_STATE: MapContextState = {
  mapIndex: 0,
  mapList: EXAMPLE_MAPS,
  mapPosition: {
    x: 0,
    y: 0,
    scale: 0.4, // TODO: Calculate This from the image size
  },
};

export const mapContextReducer = (state: MapContextState, action: Action) => {
  const currentMap = state.mapList[state.mapIndex];
  let newMap: Map = { ...currentMap };
  let newMapList: Map[] = [...state.mapList];

  switch (action.type) {
    case "ADD_MAP":
      const newMapURL = action.payload;
      newMap = {
        url: newMapURL,
        key: generateMapKey(newMapURL),
      };
      newMapList.splice(state.mapIndex, 0, newMap);
      return {
        ...state,
        mapList: newMapList,
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
