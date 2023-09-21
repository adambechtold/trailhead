import React from "react";

export default function Offline() {
  return (
    <div style={{ margin: "1rem" }}>
      <h1>This Page is Offline</h1>
      <p>Reload Trailhead when you're connected to cache the site.</p>
      <h2>Consider Saving Trailhead to Your Phone</h2>
      <h3>iPhone</h3>
      <ol>
        <li>Open Trailhead in a Browser</li>
        <li>Go to the Main Navigation Page</li>
        <li>Open the Share Menu</li>
        <li>Click "Add to Homescreen" and Follow the Prompts</li>
      </ol>
      <h3>Android</h3>
      <ol>
        <li>Open Trailhead in Chrome</li>
        <li>Click the "three dot" Icon</li>
        <li>Select "Add to Homescreen"</li>
      </ol>
    </div>
  );
}
