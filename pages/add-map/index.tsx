import React from "react";
import AddMap from "@/components/AddMap/AddMap";

import styles from "./index.module.css";
import HelpButton from "@/components/HelpButton";

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
