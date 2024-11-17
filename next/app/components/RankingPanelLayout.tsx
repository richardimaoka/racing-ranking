import { PanelHeader } from "./PanelHeader";
import { RankingItem, RankingItemProps } from "./RankingItem";
import styles from "./RankingPanelLayout.module.css";

interface Props {
  items: RankingItemProps[];
}

export function RankingPanelLayout(props: Props) {
  return (
    <div className={styles.component}>
      <PanelHeader />
      <div className={styles.rankingList}>
        {props.items.map((x) => (
          <RankingItem
            key={x.name}
            team={x.team}
            teamIconPath={x.teamIconPath}
            name={x.name}
            ranking={x.ranking}
            interval={x.interval}
            next={x.next}
          />
        ))}
      </div>
    </div>
  );
}
