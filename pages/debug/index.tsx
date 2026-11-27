import DisplayMapData from "@/components/Debug/DisplayMapData/DisplayMapData";
import React from "react";

import styles from "./index.module.css";

export default function DebugPage() {
  return (
    <div className={styles.container}>
      <DisplayMapData />
    </div>
  );
}
