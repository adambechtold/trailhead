import React from "react";
import Button from "@/components/Buttons/Button";
import { CircleConfirmIcon } from "@/components/Icons/Icons";
import styles from "../Toasts.module.css";

type Props = {
  onDismiss: () => void;
};

export default function ConfirmTrackingLocation({ onDismiss }: Props) {
  return (
    <div className={styles["container"]}>
      <CircleConfirmIcon />
      <div className={styles["description-container"]}>
        <p>Tracking your location.</p>
        <p>Enjoy your hike!</p>
      </div>
      <Button onClick={onDismiss} size="small" type="clear">
        Dismiss
      </Button>
    </div>
  );
}
