import React, { useEffect, useReducer, useState } from "react";

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
  const [db, setDb] = useState<IDBDatabase | null>(null);

  useEffect(() => {
    const request = indexedDB.open("names", 1);
    request.onsuccess = (event) => {
      setDb(event.target.result as IDBDatabase);
      const nowDB = event.target.result as IDBDatabase;

      // get all names
      const transaction = nowDB.transaction(["names"], "readonly");
      const objectStore = transaction.objectStore("names");
      const getNamesRequest = objectStore.getAll();
      getNamesRequest.onsuccess = (event) => {
        const names = event.target.result as { key: string; name: string }[];
        increaseStorageDispatch({
          type: "SET_NAMES",
          payload: {
            value: names.map((result) => result.name),
            db: null,
          },
        });
      };
    };
    request.onupgradeneeded = (event) => {
      const db = event.target.result as IDBDatabase;
      const objectStore = db.createObjectStore("names", {
        keyPath: "key",
      });
    };
    request.onerror = (event) => {
      console.error("error: ", event);
    };
  }, []);

  const onAddName = (name: string) => {
    increaseStorageDispatch({
      type: "ADD_NAME",
      payload: {
        value: name,
        db,
      },
    });
  };

  const deleteName = (index: number) => {
    increaseStorageDispatch({
      type: "DELETE_NAME",
      payload: {
        value: index,
        db,
      },
    });
  };

  return (
    <div>
      <h1>Let's Store Items with IndexedDB</h1>
      <input
        type="text"
        value={nameInput}
        onChange={(e) => setNameInput(e.target.value)}
      />
      <button onClick={() => onAddName(nameInput)}>Add Name</button>
      <h2>Names</h2>
      {increaseStorageState.names.slice(0, 100).map((name, index) => (
        <div key={`name-${index}`}>
          {name}
          <button onClick={() => deleteName(index)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
