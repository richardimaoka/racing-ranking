import { useEffect, useState } from "react";
import { PitInItem } from "../item/PitInItem";
import { RankingItem, RankingItemProps } from "../item/RankingItem";
import { RetiredItem } from "../item/RetiredItem";
import { PanelHeader } from "../PanelHeader";
import { movePitInItemsToBottom } from "./rankingPitInListing";
import { updateRanking } from "./rankingUpdateRanking";
import styles from "./RankingUpdateRanking.module.css";

type Props = {
  currentItems: RankingItemProps[];
  nextItems: RankingItemProps[];
  onAnimationDone?: () => void;
};

type AnimationPhase = "pre" | "updating" | "callback" | "done";

function RankingUpdateRankingListing(props: Props) {
  const initItems = movePitInItemsToBottom(props.currentItems, props.nextItems);

  const [items, setItems] = useState(initItems);
  const [phase, setPhase] = useState<AnimationPhase>("pre");

  const onAnimationDone = props.onAnimationDone;

  useEffect(() => {
    switch (phase) {
      case "pre":
        const updatedItems = updateRanking(props.currentItems, props.nextItems);
        setItems(updatedItems);
        setPhase("updating");
        return;
      case "updating":
        setPhase("callback");
        return;
      case "callback":
        if (onAnimationDone) {
          onAnimationDone();
        }
        return;
      case "done":
        //do nothing
        return;
      default:
        const _exhaustiveCheck: never = phase;
        return _exhaustiveCheck;
    }
  }, [phase, props.currentItems, props.nextItems, onAnimationDone, initItems]);

  switch (phase) {
    case "pre":
      return (
        <div className={styles.rankingList}>
          {items.map((x) =>
            x.retired ? (
              <RetiredItem key={x.name} {...x} />
            ) : x.pitIn ? (
              <PitInItem key={x.name} {...x} />
            ) : (
              <RankingItem key={x.name} {...x} />
            )
          )}
        </div>
      );
    case "updating":
      return (
        <div className={styles.rankingList}>
          {items.map((x) =>
            x.retired ? (
              <RetiredItem key={x.name} {...x} />
            ) : x.pitIn ? (
              <PitInItem key={x.name} {...x} />
            ) : (
              <RankingItem key={x.name} {...x} />
            )
          )}
        </div>
      );
    case "callback":
      return (
        <div className={styles.rankingList}>
          {items.map((x) =>
            x.retired ? (
              <RetiredItem key={x.name} {...x} />
            ) : x.pitIn ? (
              <PitInItem key={x.name} {...x} />
            ) : (
              <RankingItem key={x.name} {...x} />
            )
          )}
        </div>
      );
    case "done":
      return (
        <div className={styles.rankingList}>
          {items.map((x) =>
            x.retired ? (
              <RetiredItem key={x.name} {...x} />
            ) : x.pitIn ? (
              <PitInItem key={x.name} {...x} />
            ) : (
              <RankingItem key={x.name} {...x} />
            )
          )}
        </div>
      );
    default:
      //https://www.typescriptlang.org/docs/handbook/2/narrowing.html#exhaustiveness-checking
      const _exhaustiveCheck: never = phase;
      return _exhaustiveCheck;
  }
}

export function RankingUpdateRanking(props: Props) {
  return (
    <div className={styles.component}>
      <PanelHeader />
      <RankingUpdateRankingListing {...props} />
    </div>
  );
}
