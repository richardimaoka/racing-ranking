import { useState } from "react";
import { FastestItem } from "../animation/FastestItem";
import { RankingItemProps } from "../item/RankingItem";
import { RankingItemStatic } from "../item/RankingItemStatic";
import { UpdateItem } from "../item/UpdateItem";
import { PanelHeader } from "../PanelHeader";
import { doneItemsForValueChange, initItemsForValueChange } from "./listing";
import styles from "./Listing.module.css";

interface Props {
  currentItems: RankingItemProps[];
  nextItems: RankingItemProps[];
  onAnimationDone?: () => void;
}

type AnimationState = {
  name: string;
  height: number;
  doneUpdate: boolean;
};

function extractUpdates(items: RankingItemProps[]): AnimationState[] {
  return items
    .filter((i) => {
      const rankingChanged = i.ranking !== i.next?.ranking;
      const intervalChanged = i.interval !== i.next?.interval;
      return rankingChanged || intervalChanged;
    })
    .map((i) => ({
      name: i.name,
      doneUpdate: false,
      height: 0,
    }));
}

type AnimationPhase = "fastest" | "update" | "done";

function RankingUpdateItemsListing(props: Props) {
  const [phase, setPhase] = useState<AnimationPhase>("fastest");
  const initUpdates = extractUpdates(props.nextItems);
  const [updates, setUpdates] = useState<AnimationState[]>(initUpdates);

  //--------------------------------------------
  // Setters and getters on the `retires` state
  //--------------------------------------------
  function setUpdateDone(name: string) {
    const index = updates.findIndex((i) => i.name === name);
    if (index === -1 || index >= updates.length) {
      const itemNames = "[" + updates.map((i) => i.name).join(", ") + "]";
      throw new Error(
        `name = ${name} not found in ${itemNames}. index = ${index} out of range`
      );
    }

    // set status as `done`
    const updated = [...updates];
    updated[index].doneUpdate = true;
    setUpdates(updated);

    // if everything is done
    const doneItems = updated.filter((i) => i.doneUpdate);
    if (doneItems.length === updates.length) {
      setPhase("done");
    }
  }

  //--------------------------------------------
  // Switched rendering
  //--------------------------------------------
  switch (phase) {
    case "fastest": {
      const items = initItemsForValueChange(
        props.currentItems,
        props.nextItems
      );
      return (
        <div className={styles.rankingList}>
          {items.map((x) => {
            if (x.fastest) {
              return (
                <FastestItem key={x.name}>
                  <RankingItemStatic {...x} />
                </FastestItem>
              );
            } else {
              return <RankingItemStatic key={x.name} {...x} />;
            }
          })}
        </div>
      );
    }
    case "update": {
      const items = doneItemsForValueChange(
        props.currentItems,
        props.nextItems
      );

      return (
        <div className={styles.rankingList}>
          {items.map((x) => {
            const rankingChanged = x.ranking !== x.next?.ranking;
            const intervalChanged = x.interval !== x.next?.interval;

            if (x.retired || x.pitIn) {
              return <RankingItemStatic key={x.name} {...x} />;
            } else if (rankingChanged || intervalChanged) {
              return (
                <UpdateItem
                  key={x.name}
                  team={x.team}
                  teamIconPath={x.teamIconPath}
                  name={x.name}
                  currentRanking={x.ranking}
                  nextRanking={x.next?.ranking}
                  currentInterval={x.interval}
                  nextInterval={x.next?.interval}
                  onAnimationDone={() => setUpdateDone(x.name)}
                />
              );
            } else {
              return <RankingItemStatic key={x.name} {...x} />;
            }
          })}
        </div>
      );
    }
    case "done": {
      const items = doneItemsForValueChange(
        props.currentItems,
        props.nextItems
      );

      return (
        <div className={styles.rankingList}>
          {items.map((x) => (
            <RankingItemStatic key={x.name} {...x} />
          ))}
        </div>
      );
    }
    default:
      const _exhaustiveCheck: never = phase;
      return _exhaustiveCheck;
  }
}

export function RankingUpdateItems(props: Props) {
  return (
    <div className={styles.component}>
      <PanelHeader />
      <RankingUpdateItemsListing {...props} />
    </div>
  );
}
