import { RankingItemProps } from "../item/itemProps";
import { StaticItemSwitch } from "../item/StaticItemSwitch";
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
          <StaticItemSwitch key={x.name} {...x} />
        ))}
      </div>
    </div>
  );
}
