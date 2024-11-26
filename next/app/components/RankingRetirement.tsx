import { useEffect, useState } from "react";
import { PanelHeader } from "./PanelHeader";
import { RankingItem, RankingItemProps } from "./RankingItem";
import styles from "./RankingRetirement.module.css";
import { ShrinkItem } from "./ShrinkItem";

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

function augmentRetirement(
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

export function RankingRetirement(props: Props) {
  const [items, setItems] = useState(props.currentItems);
  const [phase, setPhase] = useState<AnimationPhase>("pre");
  const [shrinkItems, setShrinkItems] = useState<ShrinkItem[]>([]);
  const isShrinkDone =
    shrinkItems.length > 0 && shrinkItems.findIndex((i) => !i.done) === -1;

  useEffect(() => {
    switch (phase) {
      case "pre":
        const augmentedItems = augmentRetirement(
          props.currentItems,
          props.nextItems
        );

        setItems(augmentedItems);
        setShrinkItems(extractShrinkItems(augmentedItems));
        setPhase("shrink");
        return;
      case "shrink":
        if (isShrinkDone) {
          setPhase("insert");
          setItems(props.nextItems);
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

  function setShrinkHeight(name: string, height: number) {
    const index = shrinkItems.findIndex((i) => i.name === name);
    const updated = [...shrinkItems];

    if (index < shrinkItems.length) {
      updated[index].height = height;
    } else {
      // supposedly this shouldn't happen....
    }

    setShrinkItems(updated);
  }

  return (
    <div className={styles.component}>
      <PanelHeader />
      <div className={styles.rankingList}>
        {items.map((x) =>
          x.retired ? (
            <ShrinkItem
              key={x.name}
              onHeightCalculated={(height) => setShrinkHeight(x.name, height)}
              onDoneAnimation={() => setShrinkDone(x.name)}
            >
              <RankingItem
                team={x.team}
                teamIconPath={x.teamIconPath}
                name={x.name}
                ranking={x.ranking}
                interval={x.interval}
                next={x.next}
              />
            </ShrinkItem>
          ) : (
            <RankingItem
              key={x.name}
              team={x.team}
              teamIconPath={x.teamIconPath}
              name={x.name}
              ranking={x.ranking}
              interval={x.interval}
              next={x.next}
            />
          )
        )}
      </div>
    </div>
  );
}
