import { useState } from "react";
import { InsertItem } from "../animation/InsertItem";
import { ShrinkItem } from "../animation/ShrinkItem";
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

type ShrinkItem = {
  name: string;
  height: number;
  done: boolean;
};

function extractShrinkItems(items: RankingItemProps[]): ShrinkItem[] {
  return items
    .filter((i) => i.retired)
    .map((i) => ({ name: i.name, done: false, height: 0 }));
}

type InsertItem = {
  name: string;
  done: boolean;
};

function extractInsertItems(items: RankingItemProps[]): InsertItem[] {
  return items
    .filter((i) => i.retired)
    .map((i) => ({ name: i.name, done: false }));
}

type AnimationPhase = "shrink" | "insert" | "done";

function RankingRetirementListing(props: Props) {
  const initShrinkItems = extractShrinkItems(props.nextItems);
  const initInsertItems = extractInsertItems(props.nextItems);

  const [phase, setPhase] = useState<AnimationPhase>("shrink");
  const [shrinkItems, setShrinkItems] = useState<ShrinkItem[]>(initShrinkItems);
  const [insertItems, setInsertItems] = useState<InsertItem[]>(initInsertItems);

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
    setShrinkItems(initShrinkItems);
    setInsertItems(initInsertItems);
    setPhase("shrink");
  }

  function setShrinkDone(name: string) {
    const index = shrinkItems.findIndex((i) => i.name === name);
    if (index === -1 || index >= shrinkItems.length) {
      const itemNames = "[" + shrinkItems.map((i) => i.name).join(", ") + "]";
      throw new Error(
        `name = ${name} not found in ${itemNames}. index = ${index} out of range`
      );
    }

    // set insert status as `done`
    const updated = [...shrinkItems];
    updated[index].done = true;
    setShrinkItems(updated);

    // if everything is done
    const doneItems = updated.filter((i) => i.done);
    if (doneItems.length === shrinkItems.length) {
      setPhase("insert");
    }
  }

  function setInsertDone(name: string) {
    const index = insertItems.findIndex((i) => i.name === name);
    if (index === -1 || index >= insertItems.length) {
      const itemNames = "[" + insertItems.map((i) => i.name).join(", ") + "]";
      throw new Error(
        `name = ${name} not found in ${itemNames}. index = ${index} out of range`
      );
    }

    // set insert status as `done`
    const updated = [...insertItems];
    updated[index].done = true;
    setInsertItems(updated);

    // if everything is done
    const doneItems = updated.filter((i) => i.done);
    if (doneItems.length === insertItems.length) {
      setPhase("done");

      if (props.onAnimationDone) {
        props.onAnimationDone();
      }
    }
  }

  function setItemHeight(name: string, height: number) {
    const index = shrinkItems.findIndex((i) => i.name === name);
    if (index === -1 || index >= shrinkItems.length) {
      const itemNames = "[" + shrinkItems.map((i) => i.name).join(", ") + "]";
      throw new Error(
        `name = ${name} not found in ${itemNames}. index = ${index} out of range`
      );
    }

    const updated = [...shrinkItems];
    updated[index].height = height;
    setShrinkItems(updated);
  }

  function getItemHeight(name: string) {
    const item = shrinkItems.find((i) => i.name === name);
    if (!item) {
      const itemNames = "[" + shrinkItems.map((i) => i.name).join(", ") + "]";
      throw new Error(
        `name = ${name} not found in ${itemNames}. index = ${index} out of range`
      );
    }

    return item.height;
  }

  switch (phase) {
    case "shrink":
      const augmentedItems = augmentRetirementInfo(
        props.currentItems,
        props.nextItems
      );

      return (
        <div className={styles.rankingList}>
          {augmentedItems.map((x) =>
            x.retired ? (
              <ShrinkItem
                key={x.name}
                onHeightCalculated={(height) => setItemHeight(x.name, height)}
                onAnimationDone={() => setShrinkDone(x.name)}
              >
                <RankingItemNormal {...x} />
              </ShrinkItem>
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
