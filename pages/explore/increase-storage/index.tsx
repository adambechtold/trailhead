import React, { useReducer, useState } from "react";

import {
  increaseStorageReducer,
  INITIAL_STATE,
} from "./increaseStorageReducer";

export default function IncreaseStorage() {
  const [increaseStorageState, increaseStorageDispatch] = useReducer(
    increaseStorageReducer,
    INITIAL_STATE
  );
  const [nameInput, setNameInput] = useState("");

  const onAddName = () => {
    increaseStorageDispatch({ type: "ADD_NAME", payload: nameInput });
  };
  const onDeleteName = (index: number) => {
    increaseStorageDispatch({ type: "DELETE_NAME", payload: index });
  };

  console.log(increaseStorageState);

  return (
    <div>
      <h1>Let's Store Items with IndexedDB</h1>
      <input
        type="text"
        value={nameInput}
        onChange={(e) => setNameInput(e.target.value)}
      />
      <button onClick={onAddName}>Add Name</button>
      {increaseStorageState.names.map((name, index) => (
        <div key={`name-${index}`}>
          {name}
          <button onClick={() => onDeleteName(index)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
