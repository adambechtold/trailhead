import { Map } from "./Map";

type StorageStrategy = "LOCAL_STORAGE" | "INDEXED_DB";

export interface MapStorageManager {
  storageStrategy: StorageStrategy;
  getMapKeys(): Promise<string[]>;
  getMaps(): Promise<Map[]>;
  getMapByKey(key: string): Promise<Map | undefined>;
  addMap(map: Map): Promise<boolean>;
  putMap(map: Map): Promise<boolean>;
  deleteMapByKey(key: string): Promise<boolean>;
}

export class MapStorageManager {
  constructor(storageStrategy: StorageStrategy) {
    this.storageStrategy = storageStrategy;
    switch (storageStrategy) {
      case "LOCAL_STORAGE":
        updateLocalStorageToLatest();
        this.getMapKeys = getMapKeysFromLocalStorage;
        this.getMaps = getMapsFromLocalStorage;
        this.getMapByKey = getMapFromLocalStorage;
        this.addMap = (map: Map) => saveMapToLocalStorage(map, false);
        this.putMap = (map: Map) => saveMapToLocalStorage(map, true);
        this.deleteMapByKey = deleteMapFromLocalStorage;
        break;
      case "INDEXED_DB":
        this.getMapKeys = getMapKeysFromIndexedDB;
        this.getMaps = getMapsFromIndexedDB;
        this.getMapByKey = getMapFromIndexedDB;
        this.addMap = (map: Map) => saveMapToIndexedDB(map, false);
        this.putMap = (map: Map) => saveMapToIndexedDB(map, true);
        this.deleteMapByKey = deleteMapFromIndexedDB;
        // Load Maps from Local Storage into IndexedDB
        updateLocalStorageToLatest().then(() => {
          getMapsFromLocalStorage().then((maps) => {
            maps.forEach((map) => this.addMap(map));
          });
        });
        break;
      default:
        throw new Error("Invalid storage strategy");
    }
  }
}

// =========== SAVE MAP ============
const saveMapToLocalStorage = async (
  map: Map,
  overwriteIfExists: boolean = true
) => {
  const savedMapKeys = await getMapKeysFromLocalStorage();
  const mapIndex = savedMapKeys.indexOf(map.key);
  const mapAlreadyExists = mapIndex !== -1;
  if (mapAlreadyExists && !overwriteIfExists) return true;

  const newSavedMapKeys = [...savedMapKeys];
  if (mapAlreadyExists) {
    newSavedMapKeys[mapIndex];
  } else {
    newSavedMapKeys.push(map.key);
  }

  try {
    localStorage.setItem("savedMapKeys", JSON.stringify(newSavedMapKeys));
    localStorage.setItem(
      formatKeyForLocalStorage(map.key),
      JSON.stringify(map)
    );
    return true;
  } catch (e) {
    localStorage.setItem("savedMapKeys", JSON.stringify(savedMapKeys));
    localStorage.removeItem(formatKeyForLocalStorage(map.key));
    return false;
  }
};

async function saveMapToIndexedDB(
  map: Map,
  overwriteIfExists: boolean = true
): Promise<boolean> {
  const savedMapKeys = await getMapKeysFromIndexedDB();
  const mapAlreadyExists = savedMapKeys.includes(map.key);

  if (!overwriteIfExists && mapAlreadyExists) return true;

  const db = await getMapsDB();
  const transaction = db.transaction("maps", "readwrite");
  const objectStore = transaction.objectStore("maps");

  return new Promise((resolve, reject) => {
    const request = objectStore.put(map);
    request.onerror = onIndexDBRequestError;
    request.onsuccess = (event) => {
      resolve(true);
    };
  });
}

// =========== GET MAP KEYS ============
async function getMapKeysFromLocalStorage(): Promise<string[]> {
  const result = localStorage.getItem("savedMapKeys");
  return result ? JSON.parse(result) : [];
}

async function getMapKeysFromIndexedDB(): Promise<string[]> {
  const db = await getMapsDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("maps", "readonly");
    const objectStore = transaction.objectStore("maps");
    const request = objectStore.getAllKeys();
    request.onerror = reject;
    request.onsuccess = () => resolve(request.result as string[]);
  });
}

// =========== GET MAPS ============
async function getMapsFromLocalStorage(): Promise<Map[]> {
  const savedMapKeys = await getMapKeysFromLocalStorage();
  const savedMaps = savedMapKeys.map((key) => {
    const mapString = localStorage.getItem(formatKeyForLocalStorage(key));
    const parsedMap = JSON.parse(mapString || "");
    return mapString ? JSON.parse(mapString) : undefined;
  });
  return savedMaps.filter((map) => map !== undefined) as Map[];
}

async function getMapsFromIndexedDB(): Promise<Map[]> {
  const db = await getMapsDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("maps", "readonly");
    const objectStore = transaction.objectStore("maps");
    const request = objectStore.getAll();
    request.onerror = reject;
    request.onsuccess = () => resolve(request.result as Map[]);
  });
}

// =========== GET MAP BY KEY ============
async function getMapFromLocalStorage(key: string): Promise<Map | undefined> {
  const mapString = localStorage.getItem(formatKeyForLocalStorage(key));
  return mapString ? JSON.parse(mapString) : undefined;
}

async function getMapFromIndexedDB(key: string): Promise<Map | undefined> {
  const db = await getMapsDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("maps", "readonly");
    const objectStore = transaction.objectStore("maps");
    const request = objectStore.get(key);
    request.onerror = reject;
    request.onsuccess = () => resolve(request.result as Map);
  });
}

// =========== DELETE MAP BY KEY ============
async function deleteMapFromLocalStorage(key: string): Promise<boolean> {
  const savedMapKeys = await getMapKeysFromLocalStorage();
  const newSavedMapKeys = savedMapKeys.filter((k) => k !== key);
  try {
    localStorage.setItem("savedMapKeys", JSON.stringify(newSavedMapKeys));
    localStorage.removeItem(formatKeyForLocalStorage(key));
    return true;
  } catch (e) {
    localStorage.setItem("savedMapKeys", JSON.stringify(savedMapKeys));
    return false;
  }
}

async function deleteMapFromIndexedDB(key: string): Promise<boolean> {
  const db = await getMapsDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("maps", "readwrite");
    const objectStore = transaction.objectStore("maps");
    const request = objectStore.delete(key);
    request.onerror = reject;
    request.onsuccess = () => resolve(true);
  });
}

// =========== INDEXEDDB UTILS ============
async function getMapsDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("maps", 1);
    request.onerror = onIndexDBRequestError;
    request.onsuccess = () => resolve(request.result as IDBDatabase);
    request.onupgradeneeded = (event) => configureIndexedDB(request.result);
  });
}

const configureIndexedDB = (db: IDBDatabase) => {
  db.createObjectStore("maps", { keyPath: "key" });
};

const onIndexDBRequestError = (event: Event) => {
  console.error("error: ", event);
};

// ========== LOCAL STORAGE UTILS ==========
const updateLocalStorageToLatest = async () => {
  const currentVersion = localStorage.getItem("version") || "0.0.0";
  switch (currentVersion) {
    case "0.0.0":
      const mapKeys = await getMapKeysFromLocalStorage();
      const updateMap = (key: string) => {
        const map = localStorage.getItem(key);
        const parsedMap = map ? JSON.parse(map) : undefined;
        if (!map) return;
        localStorage.setItem(
          formatKeyForLocalStorage(key),
          JSON.stringify(parsedMap)
        );
        localStorage.removeItem(key);
      };
      mapKeys.forEach(updateMap);
      localStorage.setItem("version", "0.0.1");
      break;
    default:
      break;
  }
};

const formatKeyForLocalStorage = (key: string) => `map-${key}`;
