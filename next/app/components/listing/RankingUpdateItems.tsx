import { useState } from "react";
import { FastestItem } from "../animation/FastestItem";
import { RankingItemProps } from "../item/itemProps";
import { StaticItemSwitch } from "../item/StaticItemSwitch";
import { UpdateItem } from "../item/UpdateItem";
import { PanelHeader } from "../PanelHeader";
import { augmentFastestInfo, augmentUpdateInfo } from "./listing";
import styles from "./Listing.module.css";

interface Props {
  currentItems: RankingItemProps[];
  nextItems: RankingItemProps[];
  onAnimationDone?: (items: RankingItemProps[]) => void;
}

type AnimationState = {
  name: string;
  height: number;
  doneUpdate: boolean;
};

function skipFastest(items: RankingItemProps[]): boolean {
  const fastestItem = items.find((i) => i.fastest);
  return fastestItem === undefined;
}

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

  //--------------------------------------------
  // Items for each phase
  //--------------------------------------------
  const fastestPhaseItems = augmentFastestInfo(
    props.currentItems,
    props.nextItems
  );
  const donePhaseItems = augmentUpdateInfo(props.currentItems, props.nextItems);

  //--------------------------------------------
  // state
  //--------------------------------------------
  const [targets, setTargets] = useState<AnimationState[]>(
    extractUpdates(donePhaseItems)
  );

  //--------------------------------------------
  // Setters and getters on the `targets` state
  //--------------------------------------------
  function setUpdateDone(name: string) {
    const index = targets.findIndex((i) => i.name === name);
    if (index === -1 || index >= targets.length) {
      const targetNames = "[" + targets.map((i) => i.name).join(", ") + "]";
      throw new Error(
        `name = ${name} not found in ${targetNames}. index = ${index} out of range`
      );
    }

    // set status as `done`
    const updatedTargets = [...targets];
    updatedTargets[index].doneUpdate = true;
    setTargets(updatedTargets);

    // if everything is done
    const doneTargets = updatedTargets.filter((i) => i.doneUpdate);
    if (doneTargets.length === targets.length) {
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
    case "fastest": {
      if (skipFastest(fastestPhaseItems)) {
        setPhase("update");
      }

      return (
        <div className={styles.rankingList}>
          {fastestPhaseItems.map((x) => {
            if (x.fastest) {
              return (
                <FastestItem
                  key={x.name}
                  onAnimationDone={() => setPhase("update")}
                >
                  <StaticItemSwitch {...x} />
                </FastestItem>
              );
            } else {
              return <StaticItemSwitch key={x.name} {...x} />;
            }
          })}
        </div>
      );
    }
    case "update": {
      return (
        <div className={styles.rankingList}>
          {donePhaseItems.map((x) => {
            const rankingChanged = x.ranking !== x.next?.ranking;
            const intervalChanged = x.interval !== x.next?.interval;

            if (x.retired || x.pitIn) {
              return <StaticItemSwitch key={x.name} {...x} />;
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
              return <StaticItemSwitch key={x.name} {...x} />;
            }
          })}
        </div>
      );
    }
    case "done": {
      return (
        <div className={styles.rankingList}>
          {donePhaseItems.map((x) => (
            <StaticItemSwitch key={x.name} {...x} />
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
