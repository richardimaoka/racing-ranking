import styles from "./PanelHeader.module.css";

export function PanelHeader() {
  return (
    <div className={styles.component}>
      <div className={styles.title}>
        <span>THE CAR RACING</span>
      </div>
      <div className={styles.lap}>
        <div className={styles.lapContents}>
          <span>LAP</span>
          <span>
            <span className={styles.currentLap}>30</span>
            <span>/</span>
            <span className={styles.totalLaps}>69</span>
          </span>
        </div>
      </div>
    </div>
  );
}
