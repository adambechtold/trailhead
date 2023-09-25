import React, { Dispatch } from "react";

type increaseStorageState = {
  names: string[];
};

type StoreablePayload<T> = {
  value: T;
  db: IDBDatabase | null;
};

type Action =
  | {
      type: "ADD_NAME";
      payload: StoreablePayload<string>;
    }
  | { type: "SET_NAMES"; payload: StoreablePayload<string[]> }
  | { type: "DELETE_NAME"; payload: StoreablePayload<number> };

export const INITIAL_STATE: increaseStorageState = {
  names: [],
};

export const increaseStorageReducer = (
  state: increaseStorageState,
  action: Action
) => {
  const { db, value } = action.payload;
  switch (action.type) {
    case "ADD_NAME":
      const nameToAdd = value as string; // TODO: check if this is the right way to do this
      if (db) {
        const addNameTransaction = db.transaction("names", "readwrite");
        const addNameObjectStore = addNameTransaction.objectStore("names");
        addNameObjectStore.add({ key: nameToAdd, name: nameToAdd });
      }
      return {
        ...state,
        names: [...state.names, nameToAdd],
      };
    case "SET_NAMES":
      const namesToLoad = value as string[];
      return {
        ...state,
        names: namesToLoad,
      };
    case "DELETE_NAME":
      const indexToDelete = value as number;
      const isIndexNotInRange =
        indexToDelete < 0 || indexToDelete > state.names.length - 1;
      if (isIndexNotInRange) return state;
      const newNames = [...state.names];
      newNames.splice(indexToDelete, 1);
      return {
        ...state,
        names: newNames,
      };
    default:
      return state;
  }
};
