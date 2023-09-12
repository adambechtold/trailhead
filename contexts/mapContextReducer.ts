export const MAPS = [
  "/images/trailmap-timberlands-precise-1.jpeg",
  "/images/trail-map-smaller.jpeg",
  "/images/bartlett-neighborhood.jpeg",
  "/images/bartlett-closeup.jpeg",
];

export type MapContextState = {
  mapIndex: number;
};

type Action = {
  type: string;
};

export const INITIAL_STATE = {
  mapIndex: 0,
};

export const mapContextReducer = (state: MapContextState, action: Action) => {
  switch (action.type) {
    case "NEXT_MAP":
      return {
        ...state,
        mapIndex: (state.mapIndex + 1) % MAPS.length,
      };
    default:
      return state;
  }
};
