import React, { useState, useEffect } from "react";
import { Map } from "@/types/Map";

import SingleMapNavigation from "@/components/SingleMapNavigation/SingleMapNavigation";

type Props = {
  url: string;
  name: string;
};

export default function PresetMap({ url, name }: Props) {
  const [map, setMap] = useState<Map | null>(null);

  useEffect(() => {
    async function fetchMap() {
      const response = await fetch(url);
      const jsonData = await response.json();
      setMap(jsonData);
    }
    fetchMap();
  }, []);

  return (
    <>
      {!map && <div>Loading...</div>}
      {map && <SingleMapNavigation map={map} mapName={name} />}
    </>
  );
}
