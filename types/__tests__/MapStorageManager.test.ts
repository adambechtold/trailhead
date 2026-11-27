import "fake-indexeddb/auto";
import { IDBFactory } from "fake-indexeddb";
import type { Map } from "../Map";
import type { MapStorageManager as MapStorageManagerType } from "../MapStorageManager";

// The storage manager reads localStorage on start-up; Node has none.
const memory: Record<string, string> = {};
(globalThis as any).localStorage = {
  getItem: (k: string) => (k in memory ? memory[k] : null),
  setItem: (k: string, v: string) => (memory[k] = String(v)),
  removeItem: (k: string) => delete memory[k],
};

const map = (key: string): Map => ({
  key,
  url: `data:image/png;base64,${key}`,
  formatVersion: "0.2",
  pins: [],
});

// The module keeps one shared connection, so load a fresh copy per test.
function freshStorage(): MapStorageManagerType {
  jest.resetModules();
  const { MapStorageManager } = require("../MapStorageManager");
  return new MapStorageManager("INDEXED_DB");
}

beforeEach(() => {
  (globalThis as any).indexedDB = new IDBFactory();
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => jest.restoreAllMocks());

test("saves, reads and deletes a map", async () => {
  const storage = freshStorage();
  await expect(storage.putMap(map("a"))).resolves.toBe(true);
  await expect(storage.getMapKeys()).resolves.toEqual(["a"]);
  await expect(storage.getMaps()).resolves.toMatchObject([{ key: "a" }]);
  await expect(storage.deleteMapByKey("a")).resolves.toBe(true);
  await expect(storage.getMaps()).resolves.toEqual([]);
});

test("putMap resolves false when the map can't be stored", async () => {
  const storage = freshStorage();
  const unstorable = { ...map("b"), notCloneable: () => {} } as unknown as Map;
  await expect(storage.putMap(unstorable)).resolves.toBe(false);
});

test("putMap resolves false when the transaction aborts (e.g. storage full)", async () => {
  const storage = freshStorage();
  const realPut = IDBObjectStore.prototype.put;
  jest.spyOn(IDBObjectStore.prototype, "put").mockImplementation(function (
    this: IDBObjectStore,
    ...args: Parameters<IDBObjectStore["put"]>
  ) {
    const request = realPut.apply(this, args);
    this.transaction.abort();
    return request;
  });
  await expect(storage.putMap(map("c"))).resolves.toBe(false);
});

describe("when the database can't be opened", () => {
  beforeEach(() => {
    (globalThis as any).indexedDB = {
      open: () => {
        const request: any = { error: new Error("open failed") };
        setTimeout(() => request.onerror?.());
        return request;
      },
    };
  });

  test("save and delete resolve false instead of hanging", async () => {
    const storage = freshStorage();
    await expect(storage.putMap(map("d"))).resolves.toBe(false);
    await expect(storage.deleteMapByKey("d")).resolves.toBe(false);
  });

  test("reads reject instead of hanging", async () => {
    const storage = freshStorage();
    await expect(storage.getMaps()).rejects.toThrow("open failed");
  });
});
