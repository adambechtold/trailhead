import React from "react";

export default function HowToUse() {
  return (
    <div>
      <h2>How to Use Trailhead</h2>
      <ol>
        <li>
          Take a Picture of a Trailmap
          <p>Make sure that...</p>
          <ul>
            <li>North is up</li>
            <li>
              The photo is perpendicular to the trailmap, not from either side
              or skewed
            </li>
            <li>The map proportions are to scale</li>
            <li>The image of the map is clear</li>
          </ul>
        </li>
        <li>
          Set Your Current Location
          <ul>
            <li>
              Click <b>Set Pin</b> and position the crosshairs over your current
              location.
            </li>
            <li>
              The app will only set your pin if it can get an accurate location.
              If it fails, try again. Location accuracy increases over time.
            </li>
          </ul>
        </li>
        <li>
          Pin Another Location
          <p>
            Walk a short distance to a spot that's clearly marked on the map,{" "}
            <i>for example, walk to the first intersection</i>.
          </p>
          <ul>
            <li>
              Click <b>Set Pin</b> again and place the pin on your current
              location.
            </li>
          </ul>
        </li>
        <li>
          Enjoy Your Hike!
          <p>
            You've succesfully configured your map! Any time you want to see
            your location, click <b>Update Location</b>. (Constantly updated
            position should be available tomorrow, 09/19).
          </p>
        </li>
      </ol>
    </div>
  );
}
