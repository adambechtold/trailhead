import { Location } from "@/types/Vector";

import { useMapContext } from "@/contexts/MapContext";
import { useCreatePinContext } from "@/contexts/CreatePinContext";
import { useUserLocationContext } from "@/contexts/UserLocationContext";
import { CancelIcon, ConfirmIcon } from "@/components/Icons/Icons";

import Button from "@/components/Buttons/Button";

import styles from "@/components/Toolbar.module.css";

export default function Toolbar() {
  const { map, setStartPin, setEndPin, mapPosition } = useMapContext();
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

    if (!map.start) {
      setStartPin(map, newPin);
    } else {
      setEndPin(map, newPin);
    }
  };

  const handleConfirmLocation = async () => {
    if (currentAcceptedUserLocation) {
      handleAddPin(currentAcceptedUserLocation);
    } else {
      alert("Please enable location access before setting pins.");
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

  const canSetPin = map && (!map.start || !map.end);
  const canDisplaySetPin = !isCreatingPin && canSetPin;
  const canDisplayConfirmLocation = isCreatingPin;

  return (
    <div className={styles.container}>
      {canDisplaySetPin && (
        <Button
          onClick={toggleIsCreatingPin}
          type="opaque"
          size="medium"
          isElevated
        >
          Set Pin
        </Button>
      )}
      {canDisplayConfirmLocation && (
        <>
          <Button
            onClick={toggleIsCreatingPin}
            type="opaque"
            size="medium"
            isElevated
          >
            <CancelIcon />
            Cancel
          </Button>
          <Button
            onClick={handleConfirmLocation}
            type="opaque"
            size="medium"
            isElevated
          >
            <ConfirmIcon />
            Confirm
          </Button>
        </>
      )}
    </div>
  );
}
