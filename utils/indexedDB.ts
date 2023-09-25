// OPEN DB
// ADD MAP
// OVERWRITE MAP
// DELETE MAP
// LOAD MAP

export async function openDatabase(name: string, version: number) {
  const request = indexedDB.open(name, version);
  return new Promise<IDBDatabase>((resolve, reject) => {
    request.onerror = (event) => {
      reject(event);
    };
    request.onsuccess = (event) => {
      console.log("Database opened successfully", event);
      resolve(event.target?.result);
    };
  });
}
