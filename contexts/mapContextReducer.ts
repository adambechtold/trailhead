import { MapPosition } from "@/types/MapPosition";
import { Pin } from "@/types/Vector";

export type MapContextState = {
  mapIndex: number;
  start?: Pin;
  end?: Pin;
  mapPosition?: MapPosition;
};

type Action = {
  type: "NEXT_MAP" | "ADD_PIN" | "RESET_PINS" | "SET_MAP_POSITION";
  payload?: any;
};

export const MAPS = [
  "/images/trailmap-timberlands-precise-1.jpeg",
  "/images/trail-map-smaller.jpeg",
  "/images/bartlett-neighborhood.jpeg",
  "/images/bartlett-closeup.jpeg",
];

export const INITIAL_STATE = {
  mapIndex: 0,
  mapPosition: {
    x: 0,
    y: 0,
    scale: 0.4, // TODO: Calculate This from the image size
  },
};

export const mapContextReducer = (state: MapContextState, action: Action) => {
  switch (action.type) {
    case "NEXT_MAP":
      return {
        ...state,
        mapIndex: (state.mapIndex + 1) % MAPS.length,
      };
    case "ADD_PIN":
      return addPin(state, action.payload);
    case "RESET_PINS":
      const newState = { ...state };
      delete newState.start;
      delete newState.end;
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

const addPin = (state: MapContextState, pin: Pin): MapContextState => {
  if (!state.start) {
    return {
      ...state,
      start: pin,
    };
  } else if (!state.end) {
    return {
      ...state,
      end: pin,
    };
  } else {
    return state;
  }
};

// PINS FROM STORAGE
//  const resetPins = () => {
//    setPins([]);
//    localStorage.setItem("pins", JSON.stringify([]));
//  };
// Put into storage
// localStorage.setItem("pins", JSON.stringify(newPins));
