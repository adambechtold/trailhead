import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useState,
} from "react";
import { userLocationReducer, INITIAL_STATE } from "./userLocationReducer";

import { Location } from "@/types/Vector";

type UserLocationContextProviderProps = {
  children: React.ReactNode;
};

type UserLocationContext = {
  currentAcceptedUserLocation: Location | null;
  mostRecentLocation: Location | null;
  isWatchingLocation: boolean;
  error: string | null;
  startWatchingUserLocation: () => void;
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
    INITIAL_STATE
  );

  const [watchId, setWatchId] = useState<number | null>(null);

  useEffect(() => {
    return () => {
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
      "useUserLocationContext must be used within a UserLocationContextProvider"
    );
  }
  return context;
}
