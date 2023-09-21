import React from "react";
import HowToSaveOffline from "@/components/HowTo/HowToSaveOffline";

export default function Offline() {
  return (
    <div style={{ margin: "1rem" }}>
      <h1>This Page is Offline</h1>
      <p>Reload Trailhead when you're connected to cache the site.</p>
      <HowToSaveOffline />
    </div>
  );
}
