export type UserHeading = {
  heading: number | null;
  canWatchUserHeading: boolean;
  isWatchingHeading: boolean;
  error: HeadingError | null;
};

export type HeadingError =
  | "NOT_SUPPORTED"
  | "PERMISSION_DENIED"
  | "UNKNOWN_ERROR";

type Action =
  | { type: "START_WATCH_USER_HEADING" }
  | { type: "STOP_WATCH_USER_HEADING" }
  | { type: "ERROR_UPDATE_USER_HEADING"; payload: HeadingError }
  | { type: "REMOVE_ERROR_UPDATE_USER_HEADING" }
  | { type: "UPDATE_USER_HEADING"; payload: number }
  | { type: "CAN_WATCH_USER_HEADING" }
  | { type: "CANNOT_WATCH_USER_HEADING"; payload: { reason: HeadingError } };

export const INITIAL_STATE: UserHeading = {
  heading: null,
  canWatchUserHeading: false,
  isWatchingHeading: false,
  error: null,
};

export const userHeadingReducer = (state: UserHeading, action: Action) => {
  switch (action.type) {
    case "START_WATCH_USER_HEADING":
      return { ...state, isWatchingHeading: true };
    case "STOP_WATCH_USER_HEADING":
      return { ...state, isWatchingHeading: false };
    case "ERROR_UPDATE_USER_HEADING":
      return { ...state, error: action.payload, canWatchUserHeading: false };
    case "REMOVE_ERROR_UPDATE_USER_HEADING":
      return { ...state, error: null };
    case "UPDATE_USER_HEADING":
      return { ...state, heading: action.payload };
    case "CAN_WATCH_USER_HEADING":
      return { ...state, canWatchUserHeading: true };
    case "CANNOT_WATCH_USER_HEADING":
      const { reason } = action.payload;
      return { ...state, canWatchUserHeading: false, error: reason };
    default:
      return state;
  }
};
