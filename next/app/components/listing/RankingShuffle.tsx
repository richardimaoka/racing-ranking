import { useState } from "react";
import { ShuffleItem as AnimationState } from "../animation/ShuffleItem";
import { RankingItemProps } from "../item/RankingItem";
import { RankingItemNormal } from "../item/RankingItemNormal";
import { RankingItemStatic } from "../item/RankingItemStatic";
import { PanelHeader } from "../PanelHeader";
import { augmentShuffleInfo, matchToNextItemsSortOrder } from "./listing";
import styles from "./Listing.module.css";

type Props = {
  currentItems: RankingItemProps[];
  nextItems: RankingItemProps[];
  onAnimationDone?: (items: RankingItemProps[]) => void;
};

type AnimationState = {
  name: string;
  doneShuffle: boolean;
};

function extractShuffleItems(
  currentItems: RankingItemProps[],
  nextItems: RankingItemProps[]
): AnimationState[] {
  const augmentedItems = augmentShuffleInfo(currentItems, nextItems);
  return augmentedItems
    .filter((item, index) => {
      const currentRank = index + 1;
      return item.next && currentRank !== item.next.ranking;
    })
    .map((i) => ({ name: i.name, doneShuffle: false }));
}

type AnimationPhase = "shuffle" | "done";

function RankingShuffleListing(props: Props) {
  const initTargets = extractShuffleItems(props.currentItems, props.nextItems);
  const [targetItems, setTargetItems] = useState<AnimationState[]>(initTargets);
  const [phase, setPhase] = useState<AnimationPhase>("shuffle");

  // Upon props change, reset the state, otherwise React states are preserved through props change.
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  const [prevCurrentItems, setCurrentItems] = useState(props.currentItems);
  const [prevdNextItems, setNextItems] = useState(props.nextItems);
  if (
    prevCurrentItems !== props.currentItems ||
    prevdNextItems !== props.nextItems
  ) {
    setCurrentItems(props.currentItems);
    setNextItems(props.nextItems);
    setTargetItems(initTargets);
    setPhase("shuffle");
  }

  //--------------------------------------------
  // Items calculation logic
  //--------------------------------------------
  const shufflePhaseItems = augmentShuffleInfo(
    props.currentItems,
    props.nextItems
  );
  const donePhaseItems = matchToNextItemsSortOrder(
    shufflePhaseItems,
    props.nextItems
  );

  //-----------------------------------------------
  // Setters and getters on the `targetItems` state
  //-----------------------------------------------
  function setShuffleDone(name: string) {
    const index = targetItems.findIndex((i) => i.name === name);
    if (index === -1 || index >= targetItems.length) {
      const itemNames = "[" + targetItems.map((i) => i.name).join(", ") + "]";
      throw new Error(
        `name = ${name} not found in ${itemNames}. index = ${index} out of range`
      );
    }

    // set target status as `done`
    const updated = [...targetItems];
    updated[index].doneShuffle = true;
    setTargetItems(updated);

    // if everything is done
    const doneItems = updated.filter((i) => i.doneShuffle);
    if (doneItems.length === targetItems.length) {
      setPhase("done");

      if (props.onAnimationDone) {
        props.onAnimationDone(donePhaseItems);
      }
    }
  }

  //--------------------------------------------
  // Switched rendering
  //--------------------------------------------
  switch (phase) {
    case "shuffle":
      return (
        <div className={styles.rankingList}>
          {shufflePhaseItems.map((x, index) => {
            const currentRank = index + 1;
            return x.next && x.next.ranking !== currentRank ? (
              <AnimationState
                key={x.name}
                currentRank={index + 1}
                nextRank={x.next.ranking}
                onAnimationDone={() => setShuffleDone(x.name)}
                name={x.name}
              >
                <RankingItemNormal key={x.name} {...x} />
              </AnimationState>
            ) : (
              <RankingItemStatic key={x.name} {...x} />
            );
          })}
        </div>
      );
    case "done":
      return (
        <div className={styles.rankingList}>
          {donePhaseItems.map((x) => {
            return <RankingItemStatic key={x.name} {...x} />;
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
