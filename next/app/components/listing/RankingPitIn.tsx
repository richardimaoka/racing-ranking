import { useState } from "react";
import { InsertItem } from "../animation/InsertItem";
import { RemovePitInItem } from "../animation/RemovePitInItem";
import { PitInItem } from "../item/PitInItem";
import { RankingItemProps } from "../item/RankingItem";
import { RankingItemNormal } from "../item/RankingItemNormal";
import { RankingItemStatic } from "../item/RankingItemStatic";
import { PanelHeader } from "../PanelHeader";
import styles from "./Listing.module.css";
import {
  doneItemsForPitIn,
  initItemsForPitIn,
  movePitInItemsToBottom,
} from "./listing";

interface Props {
  currentItems: RankingItemProps[];
  nextItems: RankingItemProps[];
  onAnimationDone?: () => void;
}

type AnimationState = {
  name: string;
  height: number;
  doneRemove: boolean;
  doneInsert: boolean;
};

function extractPitIns(items: RankingItemProps[]): AnimationState[] {
  return items
    .filter((i) => i.pitIn)
    .map((i) => ({
      name: i.name,
      doneRemove: false,
      doneInsert: false,
      height: 0,
    }));
}

type AnimationPhase = "remove" | "insert" | "done";

function RankingPitInListing(props: Props) {
  const initPitIns = extractPitIns(props.nextItems);
  const [pitIns, setRetires] = useState<AnimationState[]>(initPitIns);
  const [phase, setPhase] = useState<AnimationPhase>("remove");

  console.log("RankingPitIn", phase);

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
    setRetires(initPitIns);
    setPhase("remove");
  }

  //--------------------------------------------
  // Items calculation logic
  //--------------------------------------------

  const removePhaseItems = initItemsForPitIn(
    props.currentItems,
    props.nextItems
  );

  const insertPhaseItems = movePitInItemsToBottom(
    props.currentItems,
    props.nextItems
  );

  const donePhaseItems = doneItemsForPitIn(props.currentItems, props.nextItems);

  //--------------------------------------------
  // Setters and getters on the `pitIns` state
  //--------------------------------------------
  function setRemoveDone(name: string) {
    const index = pitIns.findIndex((i) => i.name === name);
    if (index === -1 || index >= pitIns.length) {
      const itemNames = "[" + pitIns.map((i) => i.name).join(", ") + "]";
      throw new Error(
        `name = ${name} not found in ${itemNames}. index = ${index} out of range`
      );
    }

    // set insert status as `done`
    const updated = [...pitIns];
    updated[index].doneRemove = true;
    setRetires(updated);

    // if everything is done
    const doneItems = updated.filter((i) => i.doneRemove);
    if (doneItems.length === pitIns.length) {
      setPhase("insert");
    }
  }

  function setInsertDone(name: string) {
    const index = pitIns.findIndex((i) => i.name === name);
    if (index === -1 || index >= pitIns.length) {
      const itemNames = "[" + pitIns.map((i) => i.name).join(", ") + "]";
      throw new Error(
        `name = ${name} not found in ${itemNames}. index = ${index} out of range`
      );
    }

    // set insert status as `done`
    const updated = [...pitIns];
    updated[index].doneInsert = true;
    setRetires(updated);

    // if everything is done
    const doneItems = updated.filter((i) => i.doneInsert);
    if (doneItems.length === pitIns.length) {
      setPhase("done");

      if (props.onAnimationDone) {
        props.onAnimationDone();
      }
    }
  }

  function setItemHeight(name: string, height: number) {
    const index = pitIns.findIndex((i) => i.name === name);
    if (index === -1 || index >= pitIns.length) {
      const itemNames = "[" + pitIns.map((i) => i.name).join(", ") + "]";
      throw new Error(
        `name = ${name} not found in ${itemNames}. index = ${index} out of range`
      );
    }

    const updated = [...pitIns];
    updated[index].height = height;
    setRetires(updated);
  }

  function getItemHeight(name: string) {
    const item = pitIns.find((i) => i.name === name);
    if (!item) {
      const itemNames = "[" + pitIns.map((i) => i.name).join(", ") + "]";
      throw new Error(`name = ${name} not found in ${itemNames}`);
    }

    return item.height;
  }

  //--------------------------------------------
  // Switched rendering
  //--------------------------------------------

  switch (phase) {
    case "remove": {
      return (
        <div className={styles.rankingList}>
          {removePhaseItems.map((x) =>
            x.pitIn ? (
              <RemovePitInItem
                key={x.name}
                onHeightCalculated={(height) => setItemHeight(x.name, height)}
                onAnimationDone={() => setRemoveDone(x.name)}
              >
                <RankingItemNormal {...x} />
              </RemovePitInItem>
            ) : (
              <RankingItemStatic key={x.name} {...x} />
            )
          )}
        </div>
      );
    }
    case "insert": {
      return (
        <div className={styles.rankingList}>
          {insertPhaseItems.map((x) =>
            x.pitIn ? (
              <InsertItem
                key={x.name}
                height={getItemHeight(x.name)}
                onAnimationDone={() => {
                  setInsertDone(x.name);
                }}
              >
                <PitInItem key={x.name} {...x} />
              </InsertItem>
            ) : (
              <RankingItemStatic key={x.name} {...x} />
            )
          )}
        </div>
      );
    }
    case "done": {
      return (
        <div className={styles.rankingList}>
          {donePhaseItems.map((x) => (
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

export function RankingPitIn(props: Props) {
  return (
    <div className={styles.component}>
      <PanelHeader />
      <RankingPitInListing {...props} />
    </div>
  );
}
