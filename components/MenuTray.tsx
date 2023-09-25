import { useRef, useState } from "react";
import { useRouter } from "next/router";

import { useMapContext } from "@/contexts/MapContext";

import ListOfMaps from "./ListOfMaps";
import Toolbar from "./Toolbar";
import Button from "@/components/Button/Button";

import styles from "@/components/MenuTray.module.css";

export default function MenuTray() {
  const router = useRouter();
  const {
    map: selectedMap,
    mapList,
    chooseMap,
    deleteMap,
    downloadMap,
  } = useMapContext();
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [previousOffset, setPreviousOffset] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const INITIAL_MENU_HEIGHT = "4rem";

  const touchEventDelta = currentY - startY;
  const deltaFromOriginalPosition = touchEventDelta + previousOffset;
  const getMaximumOffset = (elementHeight: number) => {
    const rootFontSize = parseFloat(
      getComputedStyle(document.documentElement).fontSize
    );
    const maxHeightFromContent = elementHeight - 5 * rootFontSize;

    const windowHeight = window.innerHeight;
    const maxHeightFromWindow =
      windowHeight - 7 * rootFontSize - 3 * rootFontSize;

    return -Math.min(maxHeightFromContent, maxHeightFromWindow);
  };
  const getBufferedMaximumOffset = (elementHeight: number) => {
    const rootFontSize = parseFloat(
      getComputedStyle(document.documentElement).fontSize
    );
    return getMaximumOffset(elementHeight) - 19 * rootFontSize;
  };
  const maxOffset = menuRef.current
    ? getMaximumOffset(menuRef.current.offsetHeight)
    : 0;

  const handleAddNewMap = () => {
    router.push("/add-map");
  };

  const showDebuggingContent = () => {
    router.push("/debug");
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current || !menuRef.current) return;

    setIsDragging(true);
    setStartY(e.touches[0].clientY);
    setCurrentY(e.touches[0].clientY);
    containerRef.current.style.transition = "";
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current || !isDragging || !menuRef.current) return;

    setCurrentY(e.touches[0].clientY);
    let amountToOffset = deltaFromOriginalPosition; // consider the fact that this is a negative number

    const menuHeight = menuRef.current.offsetHeight;
    const maxDeltaY = getMaximumOffset(menuHeight);
    const maxDeltaYWithBuffer = getBufferedMaximumOffset(menuHeight);

    if (amountToOffset < maxDeltaYWithBuffer) {
      return;
    }
    if (amountToOffset > 0) {
      amountToOffset = amountToOffset / 2; // this probably won't work when the menu starts high
    } else if (amountToOffset < maxDeltaY) {
      amountToOffset = maxDeltaY - (maxDeltaY - amountToOffset) / 1.5;
    }

    containerRef.current.style.transform = `translate3d(0, calc(100% - ${INITIAL_MENU_HEIGHT} + ${amountToOffset}px), 0)`;
    // TODO: Fix this. This implementation is fragile because it depends on the calculation being the same as the CSS
  };

  const handleTouchEnd = () => {
    if (!containerRef.current || !menuRef.current) return;

    setIsDragging(false);

    const wasOpen = previousOffset === maxOffset;
    const wasClosed = previousOffset === 0;

    if (deltaFromOriginalPosition > 0) {
      // if we dragged below the minimum position
      closeMenu();
      return;
    }

    if (deltaFromOriginalPosition < maxOffset) {
      // if we dragged above the maximum position
      openMenu();
      return;
    }

    const wasDraggedUp = wasClosed && deltaFromOriginalPosition < -60;
    const wasDraggedDown =
      wasOpen && deltaFromOriginalPosition > maxOffset + 60;

    if (wasClosed) {
      if (wasDraggedUp) {
        openMenu();
        return;
      } else {
        closeMenu();
        return;
      }
    }

    if (wasOpen) {
      if (wasDraggedDown) {
        closeMenu();
        return;
      } else {
        openMenu();
        return;
      }
    }

    setPreviousOffset(touchEventDelta + previousOffset);
  };

  const openMenu = () => {
    if (!containerRef.current || !menuRef.current) return;
    moveMenuHeightTo(maxOffset);
    setPreviousOffset(maxOffset);
    setIsMenuOpen(true);
  };

  const closeMenu = () => {
    if (!containerRef.current || !menuRef.current) return;
    moveMenuHeightTo(0);
    setPreviousOffset(0);
    setIsMenuOpen(false);
  };

  const moveMenuHeightTo = (height: number) => {
    if (!containerRef.current) return;

    containerRef.current.style.transition = "transform 0.3s ease-in-out";
    containerRef.current.style.transform = `translate3d(0, calc(100% - ${INITIAL_MENU_HEIGHT} + ${height}px), 0)`;
  };

  const indexOfSelectedMap = mapList.findIndex(
    (map) => map.key === selectedMap.key
  );

  const toggleMenuState = () => {
    if (isMenuOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  const onDeleteMap = (mapKey: string) => {
    const result = confirm("Are you sure you want to delete this map?");
    if (result) {
      deleteMap(mapKey);
    }
  };

  return (
    <>
      {!isMenuOpen && (
        <div className={styles["position-toolbar"]}>
          <Toolbar />
        </div>
      )}
      <div
        className={styles.container}
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
      >
        <div className={styles["menu-handle"]} onClick={toggleMenuState}></div>
        <div className={styles["menu-content"]} ref={menuRef}>
          <ListOfMaps
            maps={mapList}
            selectedMapIndex={indexOfSelectedMap}
            onClickMap={chooseMap}
            onAddMap={handleAddNewMap}
            onDeleteMap={onDeleteMap}
            onShareMap={downloadMap}
          />
          <div className={styles["lower-buttons-container"]}>
            <Button onClick={showDebuggingContent}>INSPECT DATA</Button>
          </div>
        </div>
        <div className={styles["menu-buffer"]}></div>
      </div>
    </>
  );
}
