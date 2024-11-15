import { RankingPanel } from "./components/RankingPanel";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <RankingPanel />
    </div>
  );
}
