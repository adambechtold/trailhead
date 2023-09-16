import { Location } from "@/types/Vector";

import { useMapContext } from "@/contexts/MapContext";
import { useCreatePinContext } from "@/contexts/CreatePinContext";
import { useUserLocationContext } from "@/contexts/UserLocationContext";

import ClearButton from "./ClearButton/ClearButton";

import styles from "@/components/Toolbar.module.css";

export default function Toolbar() {
  const { map, addPin, mapPosition } = useMapContext();
  const { updateStatus: updateUserLocationStatus, updateUserLocation } =
    useUserLocationContext();
  const {
    startCreatePin,
    endCreatePin,
    inProgress: isCreatingPin,
    getSelectedPosition,
  } = useCreatePinContext();

  const handleAddPin = (location: Location) => {
    if (!mapPosition) return;
    const selectedPosition = getSelectedPosition();
    if (!selectedPosition) return;

    const { coordinates, accuracy } = location;
    const { latitude, longitude } = coordinates;
    const { scale } = mapPosition;
    const { x: selectedX, y: selectedY } = selectedPosition;

    const newPin = {
      mapPoint: {
        x: (selectedX - mapPosition.x) / scale,
        y: -(selectedY - mapPosition.y) / scale, // TODO adjust functionality so y is not inverted
      },
      location: {
        coordinates: {
          latitude,
          longitude,
        },
        accuracy,
      },
    };

    const index = map.start ? 1 : 0;

    addPin(newPin, index);
  };

  const handleConfirmLocation = async () => {
    const result = await updateUserLocation();
    if (result && result.updateStatus.success) {
      const location = result.userLocation;
      if (location) handleAddPin(location);
    }
    toggleIsCreatingPin();
  };

  const toggleIsCreatingPin = () => {
    if (isCreatingPin) {
      endCreatePin();
    } else {
      startCreatePin();
    }
  };

  const handleUpdateLocation = async () => {
    await updateUserLocation();
  };

  const isUpdatingLocation = updateUserLocationStatus.isUpdating;
  const canSetPin = (!map.start || !map.end) && !isUpdatingLocation;
  const canDisplaySetPin = !isCreatingPin && canSetPin;
  const canDisplayConfirmLocation = isCreatingPin && !isUpdatingLocation;
  const canDisplayUpdateLocation = !isCreatingPin && !isUpdatingLocation;
  const currentAcuracy = updateUserLocationStatus.pendingLocation?.accuracy;

  return (
    <div className={styles.container}>
      {canDisplaySetPin && (
        <ClearButton onClick={toggleIsCreatingPin}>SET PIN</ClearButton>
      )}
      {canDisplayConfirmLocation && (
        <>
          <ClearButton onClick={toggleIsCreatingPin}>
            <CancelIcon />
            CANCEL
          </ClearButton>
          <ClearButton onClick={handleConfirmLocation}>
            <ConfirmIcon />
            CONFIRM
          </ClearButton>
        </>
      )}
      {canDisplayUpdateLocation && (
        <ClearButton onClick={handleUpdateLocation}>
          UPDATE LOCATION
        </ClearButton>
      )}
    </div>
  );
}

function CancelIcon() {
  return <img className={styles["icon-img"]} src={"/cancel-x.svg"} />;
}

function ConfirmIcon() {
  return <img className={styles["icon-img"]} src={"/confirm-check.svg"} />;
}
