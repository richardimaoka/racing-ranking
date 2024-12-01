import { useState } from "react";
import { RankingItemProps } from "../item/RankingItem";
import { PanelHeader } from "../PanelHeader";
import { augmentUpdateInfo } from "./rankingUpdateItems";
import { UpdateItem } from "../item/UpdateItem";
import { RankingItemStatic } from "../item/RankingItemStatic";
import styles from "./RankingUpdateItems.module.css";

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

type AnimationPhase = "update" /*| "fastest" */ | "done";

function RankingUpdateItemsListing(props: Props) {
  const [phase, setPhase] = useState<AnimationPhase>("update");
  const initUpdates = extractUpdates(props.nextItems);
  const [updates, setUpdates] = useState<AnimationState[]>(initUpdates);
  //--------------------------------------------
  // Switched rendering
  //--------------------------------------------
  const augmentedItems = augmentUpdateInfo(props.currentItems, props.nextItems);

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

  switch (phase) {
    case "update":
      return (
        <div className={styles.rankingList}>
          {augmentedItems.map((x) => {
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
    case "done": {
      return (
        <div className={styles.rankingList}>
          {augmentedItems.map((x) => (
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
