import { Location } from "@/types/Vector";
import { ConversionStrategy } from "@/utils/vector";

const NUMBER_OF_LOCATIONS_TO_SAVE = 1000;

export type LocationAndTime = {
  // TODO: Maybe this should be saved somewhere else, like a type file
  location: Location;
  recordedAt: Date;
};

export type UserLocationState = {
  currentLocationIndex: number | null;
  userLocations: LocationAndTime[]; // sorted list of locations (newest first) - capped at last 1000
  isWatchingLocation: boolean;
  error: string | null;
  locationConversionStrategy: ConversionStrategy;
  isUserPathDisplayed: boolean; // TODO: Consider moving this into a kind of configuration state; This should just hold data about the user location
};

type Action =
  | { type: "START_WATCH_USER_LOCATION" }
  | { type: "STOP_WATCH_USER_LOCATION" }
  | { type: "ERROR_UPDATE_USER_LOCATION"; payload: string }
  | {
      type: "RECORD_USER_LOCATION";
      payload: {
        location: Location;
        time: Date;
        useLocation: boolean;
      };
    }
  | { type: "SET_CONVERSION_STRATEGY"; payload: ConversionStrategy }
  | { type: "SHOW_USER_PATH" }
  | { type: "HIDE_USER_PATH" };

export const INITIAL_STATE: UserLocationState = {
  currentLocationIndex: null,
  userLocations: [],
  isWatchingLocation: false,
  error: null,
  locationConversionStrategy: {
    scalerStrategy: "MOST-X_MOST-Y",
    originStrategy: "FIRST_POINT",
  },
  isUserPathDisplayed: false,
};

export const userLocationReducer = (
  state: UserLocationState,
  action: Action
) => {
  switch (action.type) {
    case "START_WATCH_USER_LOCATION":
      return { ...state, isWatchingLocation: true };
    case "STOP_WATCH_USER_LOCATION":
      return { ...state, isWatchingLocation: false };
    case "ERROR_UPDATE_USER_LOCATION":
      return { ...state, error: action.payload };
    case "RECORD_USER_LOCATION":
      const { location, time, useLocation } = action.payload;
      const newLocation = {
        location,
        recordedAt: time,
      };

      // assume we are not going to use the location and the current location is preserved in the list
      let locationsToKeep: LocationAndTime[] = [
        newLocation,
        ...state.userLocations.slice(0, NUMBER_OF_LOCATIONS_TO_SAVE - 1),
      ].sort(sortByNewestFirst);
      let newCurrentLocationIndex = state.currentLocationIndex
        ? state.currentLocationIndex + 1
        : 0;

      if (useLocation) {
        newCurrentLocationIndex = locationsToKeep.indexOf(newLocation);
      } else if (newCurrentLocationIndex >= NUMBER_OF_LOCATIONS_TO_SAVE) {
        // check that we don't lost the current location
        newCurrentLocationIndex = NUMBER_OF_LOCATIONS_TO_SAVE - 1; // new index is the last location
        locationsToKeep = [
          newLocation, // add the new location
          ...state.userLocations.slice(0, NUMBER_OF_LOCATIONS_TO_SAVE - 2), // fill the buffer with the old locations, leaving one space left for the old location
          ...state.userLocations.slice(NUMBER_OF_LOCATIONS_TO_SAVE), // add the current location at the end of the buffer
        ];
      }

      return {
        ...state,
        userLocations: locationsToKeep,
        currentLocationIndex: newCurrentLocationIndex,
      };
    case "SET_CONVERSION_STRATEGY":
      return { ...state, locationConversionStrategy: action.payload };
    case "SHOW_USER_PATH":
      return { ...state, isUserPathDisplayed: true };
    case "HIDE_USER_PATH":
      return { ...state, isUserPathDisplayed: false };
    default:
      return state;
  }
};

const sortByNewestFirst = (a: LocationAndTime, b: LocationAndTime) => {
  return b.recordedAt.getTime() - a.recordedAt.getTime();
};
