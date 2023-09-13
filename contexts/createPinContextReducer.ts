import { Point } from "@/types/Vector";

export type CreatePinState = {
  selectPositionElementName: string;
  inProgress: boolean;
};

type Action = {
  type: "START_CREATE_PIN" | "END_CREATE_PIN";
  payload?: Point;
};

export const INITIAL_STATE: CreatePinState = {
  selectPositionElementName: "create-pin-position-selector",
  inProgress: false,
};

export const createPinContextReducer = (
  state: CreatePinState,
  action: Action
) => {
  switch (action.type) {
    case "START_CREATE_PIN":
      return {
        ...state,
        inProgress: true,
      };
    case "END_CREATE_PIN":
      return {
        ...state,
        inProgress: false,
      };
    default:
      return state;
  }
};
