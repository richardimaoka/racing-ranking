import { useState } from "react";
import { PanelHeader } from "./PanelHeader";
import { RankingItem, RankingItemProps } from "./RankingItem";
import styles from "./RankingRetirement.module.css";
import { ShrinkItem } from "./ShrinkItem";

interface Props {
  items: RankingItemProps[];
}

type AnimationPhase = "pre" | "start";

export function RankingRetirement(props: Props) {
  const [phase, setPhase] = useState<AnimationPhase>("pre");
  const ith = 3;

  return (
    <div className={styles.component}>
      <PanelHeader />
      <div className={styles.rankingList}>
        {props.items.map((x, i) =>
          ith === i ? (
            <ShrinkItem key={x.name}>
              <RankingItem
                team={x.team}
                teamIconPath={x.teamIconPath}
                name={x.name}
                ranking={x.ranking}
                interval={x.interval}
                next={x.next}
              />
            </ShrinkItem>
          ) : (
            <RankingItem
              key={x.name}
              team={x.team}
              teamIconPath={x.teamIconPath}
              name={x.name}
              ranking={x.ranking}
              interval={x.interval}
              next={x.next}
            />
          )
        )}
      </div>
    </div>
  );
}
