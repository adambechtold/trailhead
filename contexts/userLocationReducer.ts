import { Location } from "@/types/Vector";

export type UserLocationState = {
  userLocation?: Location;
  updateStatus: {
    isUpdating: boolean;
    pendingLocation?: Location;
    success?: boolean;
    error?: boolean;
  };
};

type Action = {
  type:
    | "START_UPDATE_USER_LOCATION"
    | "FAIL_UPDATE_USER_LOCATION"
    | "SUCCEED_UPDATE_USER_LOCATION"
    | "RECORD_PENDING_USER_LOCATION";
  payload?: Location;
};

export const INITIAL_STATE: UserLocationState = {
  updateStatus: {
    isUpdating: false,
  },
};

export const userLocationReducer = (
  state: UserLocationState,
  action: Action
) => {
  switch (action.type) {
    case "START_UPDATE_USER_LOCATION":
      return {
        ...state,
        updateStatus: {
          isUpdating: true,
          success: false,
          error: false,
          pendingLocation: undefined,
        },
      };
    case "FAIL_UPDATE_USER_LOCATION":
      return {
        ...state,
        updateStatus: {
          isUpdating: false,
          success: false,
          error: true,
          pendingLocation: state.updateStatus.pendingLocation,
        },
      };
    case "SUCCEED_UPDATE_USER_LOCATION":
      return {
        userLocation: action.payload,
        updateStatus: {
          isUpdating: false,
          success: true,
          error: false,
        },
      };
    case "RECORD_PENDING_USER_LOCATION":
      return {
        ...state,
        updateStatus: {
          isUpdating: true,
          success: false,
          error: false,
          pendingLocation: action.payload,
        },
      };
    default:
      return state;
  }
};
