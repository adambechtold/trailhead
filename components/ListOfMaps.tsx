import React from "react";
import { Map } from "@/types/Map";

import styles from "@/components/ListOfMaps.module.css";

type Props = {
  maps: Map[];
  selectedMapIndex?: number;
  onClickMap?: (mapKey: string) => void;
  onAddMap?: () => void;
};

export default function ListOfMaps({
  maps,
  selectedMapIndex,
  onClickMap,
  onAddMap,
}: Props) {
  const isSelected = (index: number): boolean => {
    if (selectedMapIndex === undefined) return false;
    return index === selectedMapIndex;
  };

  const handleMapClick = (mapURL: string) => {
    if (onClickMap) onClickMap(mapURL);
  };

  return (
    <div className={styles.container}>
      {onAddMap && <AddMap onClick={onAddMap} />}
      {maps.map((map, index) => (
        <MapItem
          key={map.url}
          mapURL={map.url}
          isSelected={isSelected(index)}
          onClick={() => handleMapClick(map.key)}
        />
      ))}
    </div>
  );
}

type MapItemProps = {
  mapURL: string;
  isSelected?: boolean;
  onClick: () => void;
};

function MapItem({ mapURL, isSelected, onClick }: MapItemProps) {
  const itemPicture = (
    <img src={mapURL} className={styles["map-picture"]} onClick={onClick} />
  );
  const outline = (child: React.ReactNode) => (
    <div className={styles["selected-map-outline"]}>{child}</div>
  );

  return (
    <div className={styles["map-item-container"]}>
      {isSelected ? outline(itemPicture) : itemPicture}
    </div>
  );
}

function AddMap({ onClick }: { onClick: () => void }) {
  return (
    <div className={styles["map-item-container"]}>
      <div className={styles["add-map-container"]} onClick={onClick}>
        <div className={styles["add-map-content"]}>
          <div className={styles["add-map-icon"]}>+</div>
          <div className={styles["add-map-text"]}>Add Map</div>
        </div>
      </div>
    </div>
  );
}
