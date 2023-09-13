import React, { createContext, use, useContext, useReducer } from "react";
import {
  userLocationReducer,
  INITIAL_STATE,
  UserLocationState,
} from "./userLocationReducer";
import { getCurrentPosition } from "@/utils/location";

import { Location } from "@/types/Vector";

type UserLocationContextProviderProps = {
  children: React.ReactNode;
};

type UserLocationContext = UserLocationState & {
  updateUserLocation: () => Promise<UserLocationState | void>;
};

export const UserLocationContext = createContext<UserLocationContext | null>(
  null
);

const MAX_NUMBER_OF_RETRIES = 10;
const MINIMUM_ACCURACY = 50;
const TIME_BETWEEN_RETRIES = 1300;

export default function UserLocationContextProvider({
  children,
}: UserLocationContextProviderProps) {
  const [userLocationState, userLocationContextDispatch] = useReducer(
    userLocationReducer,
    INITIAL_STATE
  );

  const updateUserLocation = async (): Promise<UserLocationState | void> => {
    userLocationContextDispatch({ type: "START_UPDATE_USER_LOCATION" });

    for (let i = 0; i < MAX_NUMBER_OF_RETRIES; i++) {
      const position = await getCurrentPosition();

      const pendingLocation: Location = {
        coordinates: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        },
        accuracy: position.coords.accuracy,
      };
      userLocationContextDispatch({
        type: "RECORD_PENDING_USER_LOCATION",
        payload: pendingLocation,
      });

      if (position.coords.accuracy < MINIMUM_ACCURACY) {
        userLocationContextDispatch({
          type: "SUCCEED_UPDATE_USER_LOCATION",
          payload: pendingLocation,
        });
        const result = {
          userLocation: pendingLocation,
          updateStatus: {
            isUpdating: false,
            success: true,
            error: false,
          },
        };
        return result;
      }
      const message = `Accuracy of ${position.coords.accuracy} is not good enough. Minimum accuracy: ${MINIMUM_ACCURACY} Retrying...`;
      console.log(message);
      await delay(TIME_BETWEEN_RETRIES);
    }
  };

  return (
    <UserLocationContext.Provider
      value={{
        userLocation: userLocationState.userLocation,
        updateStatus: userLocationState.updateStatus,
        updateUserLocation,
      }}
    >
      {children}
    </UserLocationContext.Provider>
  );
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
