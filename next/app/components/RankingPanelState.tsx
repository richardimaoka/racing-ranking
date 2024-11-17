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
        animationEnd: false,
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

type Phase = "fetching";

export function RankingPanelState(props: Props) {
  const [phase, setPhase] = useState<Phase>("fetching");
  const [count, setCount] = useState(1);
  const [items, setItems] = useState(props.initialItems);

  useEffect(() => {
    // Fetch the next data
    if (phase === "fetching") {
      const timeoutId = setTimeout(async () => {
        const res = await fetch(`/api?count=${count}`);
        const newItems = await res.json();
        setItems(newItems);

        setCount(incrementCount(count));
        setPhase("fetching");
      }, 1000);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [phase, count, items]);

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

  return <RankingPanelLayout items={itemsWithEventLister} />;
}
