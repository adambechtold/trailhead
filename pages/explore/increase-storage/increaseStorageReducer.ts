type increaseStorageState = {
  names: string[];
};

type Action =
  | { type: "ADD_NAME"; payload: string }
  | { type: "DELETE_NAME"; payload: number };

export const INITIAL_STATE: increaseStorageState = {
  names: [],
};

export const increaseStorageReducer = (
  state: increaseStorageState,
  action: Action
) => {
  switch (action.type) {
    case "ADD_NAME":
      const nameToAdd = action.payload;
      const existingName = state.names.find((name) => name === nameToAdd);
      if (existingName) return state;
      return {
        ...state,
        names: [...state.names, nameToAdd],
      };
    case "DELETE_NAME":
      const indexToDelete = action.payload;
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
