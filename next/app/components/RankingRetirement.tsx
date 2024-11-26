import { useState } from "react";
import { PanelHeader } from "./PanelHeader";
import { RankingItem, RankingItemProps } from "./RankingItem";
import styles from "./RankingRetirement.module.css";
import { ShrinkItem } from "./ShrinkItem";

interface Props {
  currentItems: RankingItemProps[];
  nextItems: RankingItemProps[];
}

type AnimationPhase = "pre" | "start";

function augmentItems(
  currentItems: RankingItemProps[],
  nextItems: RankingItemProps[]
): RankingItemProps[] {
  return currentItems.map((current) => {
    const next = nextItems.find((n) => n.name === current.name);
    return {
      ...current,
      retired: next?.retired,
    };
  });
}

export function RankingRetirement(props: Props) {
  const augmentedItems = augmentItems(props.currentItems, props.nextItems);
  const [items, setItems] = useState(augmentedItems);
  const [phase, setPhase] = useState<AnimationPhase>("pre");
  const ith = 3;

  return (
    <div className={styles.component}>
      <PanelHeader />
      <div className={styles.rankingList}>
        {props.currentItems.map((x, i) =>
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
