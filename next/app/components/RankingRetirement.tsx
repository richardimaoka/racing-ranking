import { useEffect, useState } from "react";
import { PanelHeader } from "./PanelHeader";
import { RankingItem, RankingItemProps } from "./RankingItem";
import styles from "./RankingRetirement.module.css";
import { ShrinkItem } from "./ShrinkItem";
import { InsertItem } from "./InsertItem";

interface Props {
  currentItems: RankingItemProps[];
  nextItems: RankingItemProps[];
}

// function updateRanking(
//   currentItems: RankingItemProps[],
//   nextItems: RankingItemProps[]
// ): RankingItemProps[] {
//   return currentItems.map((current) => {
//     const next = nextItems.find((n) => n.name === current.name);
//     return {
//       ...current,
//       retired: next?.retired,
//     };
//   });
// }

function augmentRetirementInfo(
  currentItems: RankingItemProps[],
  nextItems: RankingItemProps[]
): RankingItemProps[] {
  return currentItems.map((current) => {
    const next = nextItems.find((n) => n.name === current.name);
    return {
      ...current,
      retired: next?.retired,
    };
  });
}

function moveRetiredItemsToBottom(
  currentItems: RankingItemProps[],
  nextItems: RankingItemProps[]
): RankingItemProps[] {
  // Supposedly next items have retired items at the bottom
  return nextItems.map((next) => {
    const current = currentItems.find((c) => c.name === next.name);
    // preserve current ranking and inerval
    return {
      ...next,
      ranking: current ? current.ranking : next.ranking,
      interval: current ? current.interval : next.interval,
    };
  });
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

type AnimationPhase = "pre" | "shrink" | "insert";

function RankingRetirementListing(props: Props) {
  const [items, setItems] = useState(props.currentItems);
  const [phase, setPhase] = useState<AnimationPhase>("pre");
  const [shrinkItems, setShrinkItems] = useState<ShrinkItem[]>([]);
  const isShrinkDone =
    shrinkItems.length > 0 && shrinkItems.findIndex((i) => !i.done) === -1;

  useEffect(() => {
    switch (phase) {
      case "pre":
        const augmentedItems = augmentRetirementInfo(
          props.currentItems,
          props.nextItems
        );

        setItems(augmentedItems);
        setShrinkItems(extractShrinkItems(augmentedItems));
        setPhase("shrink");
        return;
      case "shrink":
        if (isShrinkDone) {
          const updatedItems = moveRetiredItemsToBottom(
            props.currentItems,
            props.nextItems
          );
          setPhase("insert");
          setItems(updatedItems);
        }
        return;
      case "insert":
        return;
      default:
        const _exhaustiveCheck: never = phase;
        return _exhaustiveCheck;
    }
  }, [phase, props.currentItems, props.nextItems, isShrinkDone]);

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

  switch (phase) {
    case "pre":
      return (
        <div className={styles.rankingList}>
          {items.map((x) => (
            <RankingItem key={x.name} {...x} />
          ))}
        </div>
      );
    case "shrink":
      return (
        <div className={styles.rankingList}>
          {items.map((x) =>
            x.retired ? (
              <ShrinkItem
                key={x.name}
                onHeightCalculated={(height) => setItemHeight(x.name, height)}
                onDoneAnimation={() => setShrinkDone(x.name)}
              >
                <RankingItem key={x.name} {...x} />
              </ShrinkItem>
            ) : (
              <RankingItem key={x.name} {...x} />
            )
          )}
        </div>
      );
    case "insert":
      return (
        <div className={styles.rankingList}>
          {items.map((x) =>
            x.retired ? (
              <InsertItem key={x.name} height={getItemHeight(x.name)}>
                <RankingItem key={x.name} {...x} />
              </InsertItem>
            ) : (
              <RankingItem key={x.name} {...x} />
            )
          )}
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
