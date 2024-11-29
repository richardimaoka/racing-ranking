import { useEffect, useState } from "react";
import { RankingItem, RankingItemProps } from "../item/RankingItem";
import { PanelHeader } from "../PanelHeader";
import styles from "./RankingShuffle.module.css";
import { ShuffleItem } from "../animation/ShuffleItem";
import { afterShuffle, augmentShuffleInfo } from "./rankingShuffle";

type Props = {
  currentItems: RankingItemProps[];
  nextItems: RankingItemProps[];
  onAnimationDone?: () => void;
};

type ShuffleItem = {
  name: string;
  done: boolean;
};

function extractShuffleItems(items: RankingItemProps[]): ShuffleItem[] {
  return items
    .filter((item, index) => {
      const currentRank = index + 1;
      return item.next && currentRank !== item.next.ranking;
    })
    .map((i) => ({ name: i.name, done: false }));
}

type AnimationPhase = "shuffle" | "done callback" | "done";

function RankingShuffleListing(props: Props) {
  const initItems = augmentShuffleInfo(props.currentItems, props.nextItems);
  const initShuffleItems = extractShuffleItems(initItems);

  const [items, setItems] = useState(initItems);
  const [phase, setPhase] = useState<AnimationPhase>("shuffle");
  const [shuffleItems, setShuffleItems] =
    useState<ShuffleItem[]>(initShuffleItems);

  const onAnimationDone = props.onAnimationDone;

  useEffect(() => {
    switch (phase) {
      case "shuffle":
        const isShuffleDone =
          shuffleItems.length > 0 &&
          shuffleItems.findIndex((i) => !i.done) === -1;

        // if (isShuffleDone) {
        //   const updatedItems = afterShuffle(
        //     props.currentItems,
        //     props.nextItems
        //   );
        //    setPhase("done callback");
        //    setItems(updatedItems);
        // }
        return;
      case "done callback":
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
  }, [
    phase,
    props.currentItems,
    props.nextItems,
    onAnimationDone,
    initItems,
    shuffleItems,
  ]);

  function setShuffleDone(name: string) {
    const index = shuffleItems.findIndex((i) => i.name === name);
    const updated = [...shuffleItems];

    if (index === -1 || index >= shuffleItems.length) {
      const shuffleNames =
        "[" + shuffleItems.map((i) => i.name).join(", ") + "]";
      throw new Error(
        `name = ${name} not found in ${shuffleNames}. index = ${index} out of range`
      );
    } else {
      updated[index].done = true;
    }

    setShuffleItems(updated);
  }

  switch (phase) {
    case "shuffle":
      return (
        <div className={styles.rankingList}>
          {items.map((x, index) => {
            const currentRank = index + 1;
            return x.next && x.next.ranking !== currentRank ? (
              <ShuffleItem
                key={x.name}
                currentRank={index + 1}
                nextRank={x.next.ranking}
                onAnimationDone={() => setShuffleDone(x.name)}
                name={x.name}
              >
                <RankingItem key={x.name} {...x} />
              </ShuffleItem>
            ) : (
              <RankingItem key={x.name} {...x} />
            );
          })}
        </div>
      );
    case "done callback":
      return (
        <div className={styles.rankingList}>
          {items.map((x) => {
            return <RankingItem key={x.name} {...x} />;
          })}
        </div>
      );
    case "done":
      return (
        <div className={styles.rankingList}>
          {items.map((x) => {
            return <RankingItem key={x.name} {...x} />;
          })}
        </div>
      );
    default:
      const _exhaustiveCheck: never = phase;
      return _exhaustiveCheck;
  }
}

export function RankingShuffle(props: Props) {
  return (
    <div className={styles.component}>
      <PanelHeader />
      <RankingShuffleListing {...props} />
    </div>
  );
}
