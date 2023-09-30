import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useState,
} from "react";
import {
  userLocationReducer,
  INITIAL_STATE as INITIAL_LOCATION_STATE,
} from "./userLocationReducer";
import {
  userHeadingReducer,
  HeadingError,
  INITIAL_STATE as INITIAL_HEADING,
} from "./userHeadingReducer";

import { Location } from "@/types/Vector";
import { ConversionStrategy } from "@/utils/vector";

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
  startWatchingUserLocation: () => void;
  currentConversionStrategy: ConversionStrategy;
  setLocationConversionStrategy: (strategy: ConversionStrategy) => void;
};

export const UserLocationContext = createContext<UserLocationContext | null>(
  null
);

const MINIMUM_ACCURACY = 10; // meters

export default function UserLocationContextProvider({
  children,
}: UserLocationContextProviderProps) {
  const [userLocationState, userLocationContextDispatch] = useReducer(
    userLocationReducer,
    INITIAL_LOCATION_STATE
  );
  const [userHeadingState, userHeadingContextDispatch] = useReducer(
    userHeadingReducer,
    INITIAL_HEADING
  );

  const [watchId, setWatchId] = useState<number | null>(null);

  useEffect(() => {
    stopWatchingHeading();

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
  }, []);

  const startWatchingUserLocation = (): void => {
    userLocationContextDispatch({ type: "START_WATCH_USER_LOCATION" });
    const watchID = navigator.geolocation.watchPosition(
      (position) => {
        handleLocationUpdate(position);
      },
      (error) => handleLocationError(error),
      {
        enableHighAccuracy: true,
        timeout: 10000, // 10s //TODO: I'm not sure what this should be set to
        maximumAge: 0,
      }
    );
    setWatchId(watchID);
  };

  const stopWatchingUserLocation = (): void => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
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

  function getCurrentHeading(event: DeviceOrientationEvent) {
    let alpha = event.alpha; // z-axis rotation [0,360)

    if ((event as any).webkitCompassHeading) {
      alpha = (event as any).webkitCompassHeading! as number; // iOS non-standard

      userHeadingContextDispatch({
        type: "UPDATE_USER_HEADING",
        payload: alpha,
      });
    } else {
      if (!userHeadingState.error) {
        userHeadingContextDispatch({
          type: "ERROR_UPDATE_USER_HEADING",
          payload: "NOT_SUPPORTED",
        });
      }
    }
  }

  function setLocationConversionStrategy(strategy: ConversionStrategy) {
    userLocationContextDispatch({
      type: "SET_CONVERSION_STRATEGY",
      payload: strategy,
    });
  }

  const { currentLocationIndex, userLocations, isWatchingLocation, error } =
    userLocationState;

  const currentUserLocation: Location | null =
    userLocations.length > 0 && currentLocationIndex !== null
      ? userLocations[currentLocationIndex].location
      : null;
  const mostRecentLocation: Location | null =
    userLocations.length > 0 ? userLocations[0].location : null;

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
        currentConversionStrategy: userLocationState.locationConversionStrategy,
        setLocationConversionStrategy,
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
      "useUserLocationContext must be used within a UserLocationContextProvider"
    );
  }
  return context;
}
