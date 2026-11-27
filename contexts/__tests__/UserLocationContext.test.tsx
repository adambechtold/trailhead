/**
 * @jest-environment jsdom
 */
import UserLocationContextProvider, {
  useUserLocationContext,
} from "../UserLocationContext";
import { act, render } from "@testing-library/react";
import React from "react";

// A fake geolocation API that tracks which watches are still running.
let nextWatchId = 1;
let activeWatches: Set<number>;
beforeEach(() => {
  activeWatches = new Set();
  Object.defineProperty(navigator, "geolocation", {
    configurable: true,
    value: {
      watchPosition: jest.fn(() => {
        const id = nextWatchId++;
        activeWatches.add(id);
        return id;
      }),
      clearWatch: jest.fn((id: number) => activeWatches.delete(id)),
    },
  });
});

afterEach(() => {
  jest.restoreAllMocks();
  delete (window as any).DeviceOrientationEvent;
});

type Context = ReturnType<typeof useUserLocationContext>;
function renderProvider() {
  const context: { current?: Context } = {};
  function Capture() {
    context.current = useUserLocationContext();
    return null;
  }
  const view = render(
    <UserLocationContextProvider>
      <Capture />
    </UserLocationContextProvider>,
  );
  return { context, ...view };
}

test("stops watching the GPS when the provider unmounts", () => {
  const { context, unmount } = renderProvider();
  act(() => {
    context.current!.startWatchingUserLocation().catch(() => {});
  });
  expect(activeWatches.size).toBe(1);

  unmount();
  expect(activeWatches.size).toBe(0);
});

test("starting twice doesn't leave an extra GPS watch running", () => {
  const { context, unmount } = renderProvider();
  act(() => {
    context.current!.startWatchingUserLocation().catch(() => {});
  });
  act(() => {
    context.current!.startWatchingUserLocation().catch(() => {});
  });
  expect(activeWatches.size).toBe(1);

  unmount();
  expect(activeWatches.size).toBe(0);
});

test("removes the same compass listener it added", async () => {
  // iOS-style API: compass access needs permission.
  (window as any).DeviceOrientationEvent = class {
    static requestPermission = jest.fn(async () => "granted");
  };
  const addSpy = jest.spyOn(window, "addEventListener");
  const removeSpy = jest.spyOn(window, "removeEventListener");

  const { context, unmount } = renderProvider();
  await act(async () => {
    await context.current!.startWatchingHeading();
  });
  const added = addSpy.mock.calls.filter(([type]) => type === "deviceorientation");
  expect(added).toHaveLength(1);

  unmount();
  const removed = removeSpy.mock.calls.filter(([type]) => type === "deviceorientation");
  expect(removed.map(([, listener]) => listener)).toContain(added[0][1]);
});
