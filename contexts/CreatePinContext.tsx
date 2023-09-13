import React, { createContext, useContext, useReducer } from "react";
import { Point } from "@/types/Vector";
import {
  createPinContextReducer,
  INITIAL_STATE,
  CreatePinState,
} from "./createPinContextReducer";

type CreatePinContextProviderProps = {
  children: React.ReactNode;
};

type CreatePinContext = CreatePinState & {
  startCreatePin: () => void;
  endCreatePin: () => void;
  getSelectedPosition: () => Point | null;
};

export const CreatePinContext = createContext<CreatePinContext | null>(null);

export default function CreatePinContextProvider({
  children,
}: CreatePinContextProviderProps) {
  const [createPinState, createPinContextDispatch] = useReducer(
    createPinContextReducer,
    INITIAL_STATE
  );

  const startCreatePin = () => {
    createPinContextDispatch({ type: "START_CREATE_PIN" });
  };

  const endCreatePin = () => {
    createPinContextDispatch({ type: "END_CREATE_PIN" });
  };

  function getCenterPoint(element: HTMLElement): Point {
    const rect = element.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
  }

  const getSelectedPosition = (): Point | null => {
    const element = document.getElementById(
      createPinState.selectPositionElementName
    );
    if (!element) return null;

    const centerPoint = getCenterPoint(element);
    return centerPoint;
  };

  return (
    <CreatePinContext.Provider
      value={{
        ...createPinState,
        startCreatePin,
        endCreatePin,
        getSelectedPosition,
      }}
    >
      {children}
    </CreatePinContext.Provider>
  );
}

export function useCreatePinContext() {
  const createPinContext = useContext(CreatePinContext);
  if (!createPinContext) {
    throw new Error(
      "useCreatePinContext must be used within a CreatePinContextProvider"
    );
  }
  return createPinContext;
}
