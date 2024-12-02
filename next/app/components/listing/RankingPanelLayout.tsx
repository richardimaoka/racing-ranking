import { RankingItemProps } from "../item/RankingItem";
import { RankingItemStatic } from "../item/RankingItemStatic";
import { PanelHeader } from "../PanelHeader";
import styles from "./Listing.module.css";

interface Props {
  items: RankingItemProps[];
}

export function RankingPanelLayout(props: Props) {
  return (
    <div className={styles.component}>
      <PanelHeader />
      <div className={styles.rankingList}>
        {props.items.map((x) => (
          <RankingItemStatic key={x.name} {...x} />
        ))}
      </div>
    </div>
  );
}
