import { useState } from "react";
import { InsertItem } from "../animation/InsertItem";
import { RemoveItem } from "../animation/RemoveItem";
import { RankingItemProps } from "../item/RankingItem";
import { RankingItemNormal } from "../item/RankingItemNormal";
import { RankingItemStatic } from "../item/RankingItemStatic";
import { RetiredItem } from "../item/RetiredItem";
import { PanelHeader } from "../PanelHeader";
import styles from "./RankingRetirement.module.css";
import {
  augmentRetirementInfo,
  moveRetiredItemsToBottom,
} from "./rankingRetirementListing";

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

function extractRetires(items: RankingItemProps[]): AnimationState[] {
  return items
    .filter((i) => i.retired)
    .map((i) => ({
      name: i.name,
      doneRemove: false,
      doneInsert: false,
      height: 0,
    }));
}

type AnimationPhase = "remove" | "insert" | "done";

function RankingRetirementListing(props: Props) {
  const initRetires = extractRetires(props.nextItems);
  const [retires, setRetires] = useState<AnimationState[]>(initRetires);
  const [phase, setPhase] = useState<AnimationPhase>("remove");

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
    setRetires(initRetires);
    setPhase("remove");
  }

  //--------------------------------------------
  // Setters and getters on the `retires` state
  //--------------------------------------------
  function setRemoveDone(name: string) {
    const index = retires.findIndex((i) => i.name === name);
    if (index === -1 || index >= retires.length) {
      const itemNames = "[" + retires.map((i) => i.name).join(", ") + "]";
      throw new Error(
        `name = ${name} not found in ${itemNames}. index = ${index} out of range`
      );
    }

    // set insert status as `done`
    const updated = [...retires];
    updated[index].doneRemove = true;
    setRetires(updated);

    // if everything is done
    const doneItems = updated.filter((i) => i.doneRemove);
    if (doneItems.length === retires.length) {
      setPhase("insert");
    }
  }

  function setInsertDone(name: string) {
    const index = retires.findIndex((i) => i.name === name);
    if (index === -1 || index >= retires.length) {
      const itemNames = "[" + retires.map((i) => i.name).join(", ") + "]";
      throw new Error(
        `name = ${name} not found in ${itemNames}. index = ${index} out of range`
      );
    }

    // set insert status as `done`
    const updated = [...retires];
    updated[index].doneInsert = true;
    setRetires(updated);

    // if everything is done
    const doneItems = updated.filter((i) => i.doneInsert);
    if (doneItems.length === retires.length) {
      setPhase("done");

      if (props.onAnimationDone) {
        props.onAnimationDone();
      }
    }
  }

  function setItemHeight(name: string, height: number) {
    const index = retires.findIndex((i) => i.name === name);
    if (index === -1 || index >= retires.length) {
      const itemNames = "[" + retires.map((i) => i.name).join(", ") + "]";
      throw new Error(
        `name = ${name} not found in ${itemNames}. index = ${index} out of range`
      );
    }

    const updated = [...retires];
    updated[index].height = height;
    setRetires(updated);
  }

  function getItemHeight(name: string) {
    const item = retires.find((i) => i.name === name);
    if (!item) {
      const itemNames = "[" + retires.map((i) => i.name).join(", ") + "]";
      throw new Error(`name = ${name} not found in ${itemNames}`);
    }

    return item.height;
  }

  //--------------------------------------------
  // Switched rendering
  //--------------------------------------------
  switch (phase) {
    case "remove":
      const augmentedItems = augmentRetirementInfo(
        props.currentItems,
        props.nextItems
      );

      return (
        <div className={styles.rankingList}>
          {augmentedItems.map((x) =>
            x.retired ? (
              <RemoveItem
                key={x.name}
                onHeightCalculated={(height) => setItemHeight(x.name, height)}
                onAnimationDone={() => setRemoveDone(x.name)}
              >
                <RankingItemNormal {...x} />
              </RemoveItem>
            ) : (
              <RankingItemStatic key={x.name} {...x} />
            )
          )}
        </div>
      );
    case "insert": {
      const sortedItems = moveRetiredItemsToBottom(
        props.currentItems,
        props.nextItems
      );

      return (
        <div className={styles.rankingList}>
          {sortedItems.map((x) =>
            x.retired ? (
              <InsertItem
                key={x.name}
                height={getItemHeight(x.name)}
                onAnimationDone={() => {
                  setInsertDone(x.name);
                }}
              >
                <RetiredItem key={x.name} {...x} />
              </InsertItem>
            ) : (
              <RankingItemStatic key={x.name} {...x} />
            )
          )}
        </div>
      );
    }
    case "done": {
      const sortedItems = moveRetiredItemsToBottom(
        props.currentItems,
        props.nextItems
      );

      return (
        <div className={styles.rankingList}>
          {sortedItems.map((x) => (
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

export function RankingRetirement(props: Props) {
  return (
    <div className={styles.component}>
      <PanelHeader />
      <RankingRetirementListing {...props} />
    </div>
  );
}
