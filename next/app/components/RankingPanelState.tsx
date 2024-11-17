"use client";

import { useEffect, useState } from "react";
import { RankingPanelLayout } from "./RankingPanelLayout";
import { RankingItemProps } from "./RankingItem";

interface Props {
  initialItems: RankingItemProps[];
}

function augmentNextInfo(
  currentItems: RankingItemProps[],
  nextItems: RankingItemProps[]
): RankingItemProps[] {
  const augmentedItems = currentItems.map((current) => {
    const next = nextItems.find((n) => n.name === current.name);
    return {
      ...current,
      next: next && {
        ranking: next.ranking,
        interval: next.interval,
        animationEnd: current.ranking === next.ranking,
      },
    };
  });

  return augmentedItems;
}

function endAnimation(rank: number, items: RankingItemProps[]) {
  const updatedItems = items.map((item) => {
    if (item.ranking === rank) {
      const updated = { ...item };
      if (updated.next?.animationEnd) {
        updated.next.animationEnd = true;
      }

      return updated;
    } else {
      return item;
    }
  });

  return updatedItems;
}

function transitionToNext(
  currentItems: RankingItemProps[]
): RankingItemProps[] {
  const augmentedItems = currentItems.map((current) => {
    const next = current.next;
    return {
      ...current,
      ranking: next ? next.ranking : current.ranking,
      interval: next ? next.interval : current.interval,
    };
  });

  return augmentedItems;
}

function incrementCount(count: number) {
  const maxCount = 3;
  if (count < maxCount) {
    return count + 1;
  } else {
    return 1;
  }
}

type Phase = "fetch" | "sort" | "done";

async function updateItems(count: number, currentItems: RankingItemProps[]) {
  const res = await fetch(`/api?count=${count}`);
  const nextItems = await res.json();
  const augmentedItems = augmentNextInfo(currentItems, nextItems);
  return augmentedItems;
}

export function RankingPanelState(props: Props) {
  const [phase, setPhase] = useState<Phase>("fetch");
  const [count, setCount] = useState(2); //2 = next count
  const [items, setItems] = useState(props.initialItems);

  useEffect(() => {
    // Fetch the next data
    if (phase === "fetch") {
      const timeoutId = setTimeout(async () => {
        if (count === 3) {
          return;
        }
        const updatedItems = await updateItems(count, items);
        setItems(updatedItems);

        setPhase("sort");
      }, 1000);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [phase, count, items]);

  useEffect(() => {
    if (phase === "sort") {
      const animationEndFlags = items
        .map((i) => i.next?.animationEnd)
        .filter((i) => i !== undefined);

      const firstItemInAnimation = animationEndFlags.findIndex(
        (i) => i === false
      );

      // If all items finished animation
      if (firstItemInAnimation === -1) {
        setPhase("done");
        setCount(incrementCount(count));
      }
    }
  }, [phase, items, count]);

  useEffect(() => {
    if (phase === "done") {
    }
  }, [phase, items, count]);

  const itemsWithEventLister = items.map((item) => {
    return {
      ...item,
      onTransitionEnd:
        item.next &&
        (() => {
          const updatedItems = endAnimation(item.ranking, items);
          setItems(updatedItems);
        }),
    };
  });

  console.log(count, phase, itemsWithEventLister);

  return <RankingPanelLayout items={itemsWithEventLister} />;
}
