import { readData } from "../data/data";
import { PanelHeader } from "./PanelHeader";
import { RankingItem } from "./RankingItem";
import styles from "./RankingPanel.module.css";

export async function RankingPanel() {
  const items = await readData();

  return (
    <div className={styles.component}>
      <PanelHeader />
      <div>
        {items.map((x) => (
          <RankingItem
            key={x.name}
            team={x.team}
            teamIconPath={x.teamIconPath}
            name={x.name}
            ranking={x.ranking}
            interval={x.interval}
          />
        ))}
      </div>
    </div>
  );
}
