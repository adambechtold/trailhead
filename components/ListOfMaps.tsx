import React from "react";
import { Map } from "@/types/Map";

import ClearButton from "./ClearButton/ClearButton";
import { ShareIcon, TrashIcon } from "./Icons/Icons";

import styles from "@/components/ListOfMaps.module.css";

type Props = {
  maps: Map[];
  selectedMapIndex?: number;
  onClickMap?: (mapKey: string) => void;
  onAddMap?: () => void;
  onDeleteMap?: (mapKey: string) => void;
  onShareMap?: (mapKey: string) => void;
};

export default function ListOfMaps({
  maps,
  selectedMapIndex,
  onClickMap,
  onAddMap,
  onDeleteMap,
  onShareMap,
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
      {onAddMap && <AddMapOption onClick={onAddMap} />}
      {maps.map((map, index) => (
        <MapItem
          key={map.key}
          mapKey={map.key}
          mapURL={map.url}
          isSelected={isSelected(index)}
          onClick={() => handleMapClick(map.key)}
          onDelete={() => onDeleteMap && onDeleteMap(map.key)}
          onShare={() => onShareMap && onShareMap(map.key)}
        />
      ))}
    </div>
  );
}

type MapItemProps = {
  mapURL: string;
  mapKey: string;
  isSelected?: boolean;
  onClick: () => void;
  onDelete: (mapKey: string) => void;
  onShare: (mapKey: string) => void;
};

function MapItem({
  mapURL,
  mapKey,
  isSelected,
  onClick,
  onDelete,
  onShare,
}: MapItemProps) {
  const itemPicture = (
    <img src={mapURL} className={styles["map-picture"]} onClick={onClick} />
  );
  const outline = (child: React.ReactNode) => (
    <div className={styles["selected-map-outline"]}>{child}</div>
  );
  const addDeleteButton = (child: React.ReactNode) => (
    <div className={styles["can-delete-and-share-container"]}>
      {child}
      <div className={styles["buttons-container"]}>
        <DeleteButton onClick={() => onDelete(mapKey)} />
        <ShareButton onClick={() => onShare(mapKey)} />
      </div>
    </div>
  );

  return (
    <div className={styles["map-item-container"]}>
      {isSelected ? addDeleteButton(outline(itemPicture)) : itemPicture}
    </div>
  );
}

function AddMapOption({ onClick }: { onClick: () => void }) {
  return (
    <div className={styles["map-item-container"]}>
      <div className={styles["add-map-container"]} onClick={onClick}>
        <div className={styles["add-map-content"]}>
          <div className={styles["add-map-icon"]}>+</div>
          <div className={styles["add-map-text"]}>ADD MAP</div>
        </div>
      </div>
    </div>
  );
}

function DeleteButton({ onClick }: { onClick: () => void }) {
  return (
    <ClearButton onClick={onClick} size={"small"}>
      <TrashIcon />
    </ClearButton>
  );
}

function ShareButton({ onClick }: { onClick: () => void }) {
  return (
    <ClearButton onClick={onClick} size={"small"}>
      <ShareIcon />
    </ClearButton>
  );
}
