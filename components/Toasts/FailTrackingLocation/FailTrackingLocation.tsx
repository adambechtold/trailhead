import React from "react";
import Button from "@/components/Buttons/Button";
import { FailIcon } from "@/components/Icons/Icons";
import styles from "../Toasts.module.css";

type Props = {
  onDismiss: () => void;
};

export default function FailTrackingLocation({ onDismiss }: Props) {
  return (
    <div className={styles["container"]}>
      <FailIcon size="large" />
      <div className={styles["description-container"]}>
        <h4>Can't find your location</h4>
        <br />
        <p>Refresh the page and try again, or try another browser.</p>
      </div>
      <Button onClick={onDismiss} size="small" type="clear">
        Dismiss
      </Button>
    </div>
  );
}
