import styles from "@/components/Crosshairs.module.css";

type Props = {
  selectPositionElementName: string;
};

export default function Crosshairs({ selectPositionElementName }: Props) {
  type Quadrant = "upper-left" | "upper-right" | "lower-left" | "lower-right";
  const arcClass = (quadrant: Quadrant) =>
    [styles.arc, styles[quadrant]].join(" ");

  return (
    <div className={styles.container}>
      <div className={styles.centerPoint} id={selectPositionElementName} />
      <div className={styles.circle}>
        <div className={arcClass("upper-left")} />
        <div className={arcClass("lower-left")} />
        <div className={arcClass("lower-right")} />
        <div className={arcClass("upper-right")} />
      </div>
      <div className={styles.horizontalLine} />
      <div className={styles.verticalLine} />
    </div>
  );
}
