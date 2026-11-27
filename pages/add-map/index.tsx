import AddMap from "@/components/AddMap/AddMap";
import React from "react";

import HelpButton from "@/components/HelpButton";
import styles from "./index.module.css";

export default function AddMapPage() {
  return (
    <>
      <div className={styles["button-container"]}>
        <HelpButton />
      </div>
      <AddMap />
    </>
  );
}
