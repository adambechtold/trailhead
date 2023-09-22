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
  currentHeading: number | string | null; // TODO: make this a number or null
  isWatchingHeading: boolean;
  startWatchingHeading: () => void;
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
  const [currentHeading, setCurrentHeading] = useState<number | string | null>(
    "Not watching heading yet"
  ); // TODO: add this to the reducer
  const [isWatchingHeading, setIsWatchingHeading] = useState(false);

  useEffect(() => {
    stopWatchingHeading();
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

  function startWatchingUserHeading() {
    console.log("startWatchingUserHeading");
    if (!window) return;
    console.log("window exists", window);
    if (typeof DeviceOrientationEvent.requestPermission === "function") {
      DeviceOrientationEvent.requestPermission()
        .then((permissionState) => {
          if (permissionState === "granted") {
            window.addEventListener("deviceorientation", getCurrentHeading);
            setIsWatchingHeading(true);
          }
        })
        .catch(console.error);
    } else {
      window.addEventListener("deviceorientation", getCurrentHeading);
    }
    console.log("added event listener");
  }

  function stopWatchingHeading() {
    console.log("stopWatchingHeading");
    setIsWatchingHeading(false);
    if (!window) return;
    window.removeEventListener("deviceorientation", getCurrentHeading);
  }

  function getCurrentHeading(event: DeviceOrientationEvent) {
    console.log("received deviceorientation event");
    let alpha = event.alpha; // z-axis rotation [0,360)

    if (typeof event.webkitCompassHeading) {
      alpha = event.webkitCompassHeading; // iOS non-standard

      console.log("you're heading is: ", alpha);
      setCurrentHeading(alpha);
    } else {
      console.log(
        "your device can't get aboslute heading. It's showing: ",
        alpha
      );
      setCurrentHeading("Unkown");
    }
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
        currentHeading,
        isWatchingHeading,
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
      "useUserLocationContext must be used within a UserLocationContextProvider"
    );
  }
  return context;
}
