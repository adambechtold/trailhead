import {
  HeadingError,
  INITIAL_STATE as INITIAL_HEADING,
  userHeadingReducer,
} from "./userHeadingReducer";
import {
  INITIAL_STATE as INITIAL_LOCATION_STATE,
  userLocationReducer,
} from "./userLocationReducer";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from "react";

import { Location } from "@/types/Vector";

type UserLocationContextProviderProps = {
  children: React.ReactNode;
};

type UserLocationContext = {
  currentAcceptedUserLocation: Location | null;
  currentHeading: number | null;
  isWatchingHeading: boolean;
  canWatchUserHeading: boolean;
  headingError: HeadingError | null;
  startWatchingHeading: () => void;
  mostRecentLocation: Location | null;
  isWatchingLocation: boolean;
  error: string | null;
  startWatchingUserLocation: () => Promise<boolean>;
};

export const UserLocationContext = createContext<UserLocationContext | null>(
  null,
);

const MINIMUM_ACCURACY = 10; // meters

export default function UserLocationContextProvider({
  children,
}: UserLocationContextProviderProps) {
  const [userLocationState, userLocationContextDispatch] = useReducer(
    userLocationReducer,
    INITIAL_LOCATION_STATE,
  );
  const [userHeadingState, userHeadingContextDispatch] = useReducer(
    userHeadingReducer,
    INITIAL_HEADING,
  );

  // Refs, not state: the cleanup and event handlers must see the current values,
  // not the ones from the render they were created in.
  const watchIdRef = useRef<number | null>(null);
  const reportedHeadingUnsupportedRef = useRef(false);

  // Same function on every render, so removeEventListener removes what addEventListener added.
  const getCurrentHeading = useCallback((event: DeviceOrientationEvent) => {
    const compassHeading = (event as any).webkitCompassHeading; // iOS non-standard

    if (compassHeading) {
      userHeadingContextDispatch({
        type: "UPDATE_USER_HEADING",
        payload: compassHeading as number,
      });
    } else if (!reportedHeadingUnsupportedRef.current) {
      reportedHeadingUnsupportedRef.current = true;
      userHeadingContextDispatch({
        type: "ERROR_UPDATE_USER_HEADING",
        payload: "NOT_SUPPORTED",
      });
    }
  }, []);

  const startWatchingUserLocation = async (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      userLocationContextDispatch({ type: "START_WATCH_USER_LOCATION" });
      // Never run two watches at once; the old one would keep the GPS on.
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          handleLocationUpdate(position);
          resolve(true);
        },
        (error) => {
          reject(false);
          handleLocationError(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000, // 10s //TODO: I'm not sure what this should be set to
          maximumAge: 0,
        },
      );
    });
  };

  const stopWatchingUserLocation = (): void => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
      userLocationContextDispatch({ type: "STOP_WATCH_USER_LOCATION" });
    }
  };

  const handleLocationUpdate = (position: GeolocationPosition) => {
    const newLocation: Location = {
      coordinates: {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
      accuracy: position.coords.accuracy,
    };

    const locationPayload = {
      location: newLocation,
      time: new Date(),
      useLocation: position.coords.accuracy < MINIMUM_ACCURACY,
    };

    userLocationContextDispatch({
      type: "RECORD_USER_LOCATION",
      payload: locationPayload,
    });

    return locationPayload;
  };

  const handleLocationError = (error: GeolocationPositionError) => {
    console.error(error);
    userLocationContextDispatch({
      type: "ERROR_UPDATE_USER_LOCATION",
      payload: error.toString(),
    });
  };

  function getCanWatchUserHeading() {
    if (!window) return;
    if (userHeadingState.error === "PERMISSION_DENIED") return false;
    try {
      if (!DeviceOrientationEvent) return false;
    } catch (error) {
      return false;
    }
    return (
      typeof (DeviceOrientationEvent as any).requestPermission === "function"
    );
  }

  async function startWatchingUserHeading() {
    if (!window) return;
    if (
      typeof (DeviceOrientationEvent as any).requestPermission === "function"
    ) {
      const markPermissionDenied = () => {
        userHeadingContextDispatch({
          type: "ERROR_UPDATE_USER_HEADING",
          payload: "PERMISSION_DENIED",
        });
      };
      try {
        const permissionGranted =
          (await (DeviceOrientationEvent as any).requestPermission()) ===
          "granted";
        if (permissionGranted) {
          window.addEventListener("deviceorientation", getCurrentHeading);
          userHeadingContextDispatch({ type: "START_WATCH_USER_HEADING" });
        } else {
          markPermissionDenied();
        }
      } catch (error) {
        markPermissionDenied();
      }
    } else {
      userHeadingContextDispatch({
        type: "ERROR_UPDATE_USER_HEADING",
        payload: "NOT_SUPPORTED",
      });
    }
  }

  function stopWatchingHeading() {
    userHeadingContextDispatch({ type: "STOP_WATCH_USER_HEADING" });
    if (!window) return;
    window.removeEventListener("deviceorientation", getCurrentHeading);
  }

  const { currentLocationIndex, userLocations, isWatchingLocation, error } =
    userLocationState;

  const currentUserLocation: Location | null =
    userLocations.length > 0 && currentLocationIndex !== null
      ? userLocations[currentLocationIndex].location
      : null;
  const mostRecentLocation: Location | null =
    userLocations.length > 0 ? userLocations[0].location : null;

  useEffect(() => {
    stopWatchingHeading();

    // Determine if we the user's device supports user heading and put that in the state
    if (getCanWatchUserHeading()) {
      userHeadingContextDispatch({ type: "CAN_WATCH_USER_HEADING" });
    } else {
      userHeadingContextDispatch({
        type: "CANNOT_WATCH_USER_HEADING",
        payload: {
          reason: userHeadingState.error || "NOT_SUPPORTED",
        },
      });
    }

    return () => {
      stopWatchingHeading();
      stopWatchingUserLocation();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- set up once on mount, clean up on unmount
  }, []);

  return (
    <UserLocationContext.Provider
      value={{
        currentAcceptedUserLocation: currentUserLocation,
        currentHeading: userHeadingState.heading,
        canWatchUserHeading: userHeadingState.canWatchUserHeading,
        isWatchingHeading: userHeadingState.isWatchingHeading,
        headingError: userHeadingState.error,
        startWatchingHeading: startWatchingUserHeading,
        mostRecentLocation: mostRecentLocation,
        isWatchingLocation,
        error,
        startWatchingUserLocation,
      }}
    >
      {children}
    </UserLocationContext.Provider>
  );
}

export function useUserLocationContext() {
  const context = useContext(UserLocationContext);
  if (!context) {
    throw new Error(
      "useUserLocationContext must be used within a UserLocationContextProvider",
    );
  }
  return context;
}
