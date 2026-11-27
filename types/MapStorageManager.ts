import { Map, updateToLatestVersion as updateMapToLatestVersion } from "./Map";

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

// Resolves to false if the map couldn't be saved (for example, storage is full),
// like the localStorage version. It never rejects.
async function saveMapToIndexedDB(
  map: Map,
  overwriteIfExists: boolean = true
): Promise<boolean> {
  try {
    const savedMapKeys = await getMapKeysFromIndexedDB();
    const mapAlreadyExists = savedMapKeys.includes(map.key);

    if (!overwriteIfExists && mapAlreadyExists) return true;

    const db = await getMapsDB();
    const transaction = db.transaction("maps", "readwrite");
    transaction.objectStore("maps").put(map);
    // The write only counts once the transaction commits; quota errors surface as an abort.
    await transactionDone(transaction);
    return true;
  } catch (error) {
    console.error("Could not save map to IndexedDB", error);
    return false;
  }
}

// =========== GET MAP KEYS ============
async function getMapKeysFromLocalStorage(): Promise<string[]> {
  const result = localStorage.getItem("savedMapKeys");
  return result ? JSON.parse(result) : [];
}

async function getMapKeysFromIndexedDB(): Promise<string[]> {
  const db = await getMapsDB();
  const objectStore = db.transaction("maps", "readonly").objectStore("maps");
  return (await requestResult(objectStore.getAllKeys())) as string[];
}

// =========== GET MAPS ============
async function getMapsFromLocalStorage(): Promise<Map[]> {
  const savedMapKeys = await getMapKeysFromLocalStorage();
  const savedMaps = savedMapKeys.map((key) => {
    const mapString = localStorage.getItem(formatKeyForLocalStorage(key));
    return mapString ? JSON.parse(mapString) : undefined;
  });
  const mapsToReturn = savedMaps
    .filter((map) => map !== undefined)
    .map(updateMapToLatestVersion);

  return mapsToReturn;
}

async function getMapsFromIndexedDB(): Promise<Map[]> {
  const db = await getMapsDB();
  const objectStore = db.transaction("maps", "readonly").objectStore("maps");
  const maps = (await requestResult(objectStore.getAll())) as Map[];
  return maps.map(updateMapToLatestVersion);
}

// =========== GET MAP BY KEY ============
async function getMapFromLocalStorage(key: string): Promise<Map | undefined> {
  const mapString = localStorage.getItem(formatKeyForLocalStorage(key));
  return mapString ? JSON.parse(mapString) : undefined;
}

async function getMapFromIndexedDB(key: string): Promise<Map | undefined> {
  const db = await getMapsDB();
  const objectStore = db.transaction("maps", "readonly").objectStore("maps");
  return (await requestResult(objectStore.get(key))) as Map | undefined;
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

// Resolves to false if the map couldn't be deleted. It never rejects.
async function deleteMapFromIndexedDB(key: string): Promise<boolean> {
  try {
    const db = await getMapsDB();
    const transaction = db.transaction("maps", "readwrite");
    transaction.objectStore("maps").delete(key);
    await transactionDone(transaction);
    return true;
  } catch (error) {
    console.error("Could not delete map from IndexedDB", error);
    return false;
  }
}

// =========== INDEXEDDB UTILS ============
// One shared connection. If opening fails, the next call tries again.
let mapsDB: Promise<IDBDatabase> | null = null;

function getMapsDB(): Promise<IDBDatabase> {
  if (!mapsDB) {
    mapsDB = openMapsDB().catch((error) => {
      mapsDB = null;
      throw error;
    });
  }
  return mapsDB;
}

function openMapsDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    let wasBlocked = false;
    const request = indexedDB.open("maps", 1);
    request.onupgradeneeded = () => configureIndexedDB(request.result);
    request.onsuccess = () => {
      const db = request.result;
      if (wasBlocked) {
        // We already gave up on this request; don't leave the connection open.
        db.close();
        return;
      }
      // Let a newer version of the app upgrade the database in another tab.
      db.onversionchange = () => {
        db.close();
        mapsDB = null;
      };
      resolve(db);
    };
    request.onerror = () => reject(request.error);
    request.onblocked = () => {
      wasBlocked = true;
      reject(new Error("Opening the maps database is blocked by another tab"));
    };
  });
}

const configureIndexedDB = (db: IDBDatabase) => {
  db.createObjectStore("maps", { keyPath: "key" });
};

function requestResult<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function transactionDone(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () =>
      reject(transaction.error ?? new Error("Transaction aborted"));
  });
}

// ========== LOCAL STORAGE UTILS ==========
const updateLocalStorageToLatest = async () => {
  const currentVersion = localStorage.getItem("version") || "0.0.0";
  switch (currentVersion) {
    case "0.0.0": {
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
    }
    default:
      break;
  }
};

const formatKeyForLocalStorage = (key: string) => `map-${key}`;
