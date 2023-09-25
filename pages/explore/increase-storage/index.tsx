import React, { useEffect, useReducer, useCallback, useState } from "react";

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
    console.log("onAddName: ", name);
    increaseStorageDispatch({
      type: "ADD_NAME",
      payload: {
        value: name,
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
      {increaseStorageState.names.map((name, index) => (
        <div key={`name-${index}`}>{name}</div>
      ))}
    </div>
  );
}
