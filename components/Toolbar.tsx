import { Location } from "@/types/Vector";

import { useMapContext } from "@/contexts/MapContext";
import { useCreatePinContext } from "@/contexts/CreatePinContext";
import { useUserLocationContext } from "@/contexts/UserLocationContext";
import { CancelIcon, ConfirmIcon } from "./Icons/Icons";

import ClearButton from "./ClearButton/ClearButton";

import styles from "@/components/Toolbar.module.css";

export default function Toolbar() {
  const { map, addPin, mapPosition } = useMapContext();
  const { currentAcceptedUserLocation } = useUserLocationContext();
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
    if (currentAcceptedUserLocation) handleAddPin(currentAcceptedUserLocation);
    toggleIsCreatingPin();
  };

  const toggleIsCreatingPin = () => {
    if (isCreatingPin) {
      endCreatePin();
    } else {
      startCreatePin();
    }
  };

  const canSetPin = map && (!map.start || !map.end);
  const canDisplaySetPin = !isCreatingPin && canSetPin;
  const canDisplayConfirmLocation = isCreatingPin;

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
    </div>
  );
}