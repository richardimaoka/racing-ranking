import { useEffect, useState } from "react";
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

type AnimationPhase = "shrink" | "insert" | "callback" | "done";

function RankingRetirementListing(props: Props) {
  const augmentedItems = augmentRetirementInfo(
    props.currentItems,
    props.nextItems
  );
  const initShrinkItems = extractShrinkItems(augmentedItems);

  const [items, setItems] = useState(augmentedItems);
  const [phase, setPhase] = useState<AnimationPhase>("shrink");
  const [shrinkItems, setShrinkItems] = useState<ShrinkItem[]>(initShrinkItems);
  const [insertItems, setInsertItems] = useState<InsertItem[]>([]);

  const onAnimationDone = props.onAnimationDone;

  useEffect(() => {
    switch (phase) {
      case "shrink":
        const isShrinkDone =
          shrinkItems.length > 0 &&
          shrinkItems.findIndex((i) => !i.done) === -1;

        if (isShrinkDone) {
          const updatedItems = moveRetiredItemsToBottom(
            props.currentItems,
            props.nextItems
          );
          setPhase("insert");
          setItems(updatedItems);
          setInsertItems(extractInsertItems(updatedItems));
        }
        return;
      case "insert":
        const isInsertDone =
          insertItems.length > 0 &&
          insertItems.findIndex((i) => !i.done) === -1;

        if (isInsertDone) {
          setPhase("callback");
        }
        return;
      case "callback":
        if (onAnimationDone) {
          onAnimationDone();
        }
        return;
      case "done":
        // do nothing
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
    insertItems,
    shrinkItems,
  ]);

  function setShrinkDone(name: string) {
    const index = shrinkItems.findIndex((i) => i.name === name);
    const updated = [...shrinkItems];

    if (index < shrinkItems.length) {
      updated[index].done = true;
    } else {
      // supposedly this shouldn't happen....
    }

    setShrinkItems(updated);
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

    if (index < insertItems.length) {
      updated[index].done = true;
    } else {
      // supposedly this shouldn't happen....
    }

    setInsertItems(updated);
  }

  switch (phase) {
    case "shrink":
      return (
        <div className={styles.rankingList}>
          {items.map((x) =>
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
          {items.map((x) =>
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
    case "callback":
      return (
        <div className={styles.rankingList}>
          {items.map((x) => (
            <RankingItemStatic key={x.name} {...x} />
          ))}
        </div>
      );
    case "done":
      return (
        <div className={styles.rankingList}>
          {items.map((x) => (
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
