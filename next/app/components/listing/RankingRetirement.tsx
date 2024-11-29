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
  const augmentedItems = augmentRetirementInfo(
    props.currentItems,
    props.nextItems
  );
  const sortedItems = moveRetiredItemsToBottom(
    props.currentItems,
    props.nextItems
  );
  const initShrinkItems = extractShrinkItems(augmentedItems);
  const initInsertItems = extractInsertItems(sortedItems);

  const [phase, setPhase] = useState<AnimationPhase>("shrink");
  const [shrinkItems, setShrinkItems] = useState<ShrinkItem[]>(initShrinkItems);
  const [insertItems, setInsertItems] = useState<InsertItem[]>(initInsertItems);

  const [prevCurrentItems, setCurrentItems] = useState(props.currentItems);
  const [prevdNextItems, setNextItems] = useState(props.nextItems);

  // Upon props change, reset the state, otherwise React states are preserved through props change.
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  if (
    prevCurrentItems !== props.currentItems ||
    prevdNextItems !== props.nextItems
  ) {
    setCurrentItems(props.currentItems);
    setNextItems(props.nextItems);
    setShrinkItems(initShrinkItems);
    setInsertItems(initInsertItems);
  }

  switch (phase) {
    case "shrink":
      break;
    case "insert":
      const isInsertDone =
        insertItems.length > 0 && insertItems.findIndex((i) => !i.done) === -1;

      if (isInsertDone) {
        setPhase("done");
      }
      break;
    case "done":
      // do nothing
      break;
    default:
      const _exhaustiveCheck: never = phase;
      return _exhaustiveCheck;
  }

  function setShrinkDone(name: string) {
    const index = shrinkItems.findIndex((i) => i.name === name);
    const updated = [...shrinkItems];

    if (index === -1 || index >= shrinkItems.length) {
      const itemNames = "[" + shrinkItems.map((i) => i.name).join(", ") + "]";
      throw new Error(
        `name = ${name} not found in ${itemNames}. index = ${index} out of range`
      );
    }
    // set insert status as `done`
    updated[index].done = true;
    setShrinkItems(updated);

    const doneItems = updated.filter((i) => i.done);
    const shrinkItems2 = updated;
    // if everything is done
    if (doneItems.length === shrinkItems2.length) {
      setPhase("insert");
    }
  }

  function setItemHeight(name: string, height: number) {
    const index = shrinkItems.findIndex((i) => i.name === name);
    const updated = [...shrinkItems];

    if (index < shrinkItems.length) {
      updated[index].height = height;
    } else {
      // supposedly this shouldn't happen....
    }

    setShrinkItems(updated);
  }

  function getItemHeight(name: string) {
    const item = shrinkItems.find((i) => i.name === name);
    return item ? item.height : 0;
  }

  function setInsertDone(name: string) {
    const index = insertItems.findIndex((i) => i.name === name);
    const updated = [...insertItems];

    if (index === -1 || index >= insertItems.length) {
      const itemNames = "[" + insertItems.map((i) => i.name).join(", ") + "]";
      throw new Error(
        `name = ${name} not found in ${itemNames}. index = ${index} out of range`
      );
    }

    // set insert status as `done`
    updated[index].done = true;
    setInsertItems(updated);

    const doneItems = updated.filter((i) => i.done);
    const insertItems2 = updated;
    // if everything is done
    if (doneItems.length === insertItems2.length) {
      if (props.onAnimationDone) {
        props.onAnimationDone();
      }
    }
  }

  switch (phase) {
    case "shrink":
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
    case "insert":
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
    case "done":
      return (
        <div className={styles.rankingList}>
          {sortedItems.map((x) => (
            <RankingItemStatic key={x.name} {...x} />
          ))}
        </div>
      );
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
