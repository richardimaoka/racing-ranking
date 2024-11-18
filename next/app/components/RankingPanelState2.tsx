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
    const item = {
      ...current,
      // if next matching item is found, then fill in properties
      // else if not found, then `next: undefined`
      next: next && {
        ranking: next.ranking,
        interval: next.interval,
        animationEnd: current.ranking === next.ranking,
      },
    };
    return item;
  });

  return augmentedItems;
}

function attachEventListener(
  items: RankingItemProps[],
  setItems: (items: RankingItemProps[]) => void
): RankingItemProps[] {
  const updatedItems = items.map((item) => {
    if (item.next) {
      item.next.onTransitionEnd = () => {
        const updatedItems = endAnimation(item.ranking, items);
        console.log("transition finished", item.ranking, updatedItems);
        setItems(updatedItems);
      };
    }

    return item;
  });

  return updatedItems;
}

function transitionToNext(
  currentItems: RankingItemProps[]
): RankingItemProps[] {
  const updatedItems = currentItems.map((current) => {
    const next = current.next;
    current.next = undefined;
    return {
      ...current,
      ranking: next ? next.ranking : current.ranking,
      interval: next ? next.interval : current.interval,
    };
  });

  updatedItems.sort((a, b) => {
    return a.ranking - b.ranking;
  });

  return updatedItems;
}

function endAnimation(rank: number, items: RankingItemProps[]) {
  const updatedItems = items.map((item) => {
    if (item.ranking === rank) {
      console.log("end animation");
      const updated = { ...item };
      if (updated.next) {
        console.log("end animation flag updated");
        updated.next.animationEnd = true;
      }

      return updated;
    } else {
      return item;
    }
  });

  return updatedItems;
}

function isAnimationFinished(items: RankingItemProps[]) {
  const animationEndFlags = items
    .map((i) => i.next?.animationEnd)
    .filter((i) => i !== undefined);

  const stillAnimatingItem = animationEndFlags.findIndex((i) => i === false);

  if (stillAnimatingItem === -1) {
    // if no animating item left, finished!
    return true;
  } else {
    // still animating item is remaining
    return false;
  }
}

function incrementCount(count: number) {
  const maxCount = 3;
  if (count < maxCount) {
    return count + 1;
  } else {
    return 1;
  }
}

type Phase = "fetch" | "sort" | "done" | "stop";

async function updateItems(
  count: number,
  currentItems: RankingItemProps[],
  setItems: (items: RankingItemProps[]) => void
) {
  const res = await fetch(`/api?count=${count}`);
  const nextItems = await res.json();
  const augmentedItems = augmentNextInfo(currentItems, nextItems);
  const newItems = attachEventListener(augmentedItems, setItems);
  return newItems;
}

export function RankingPanelState(props: Props) {
  const [phase, setPhase] = useState<Phase>("fetch");
  const [count, setCount] = useState(2); //2 = next count
  const [items, setItems] = useState(props.initialItems);
  console.log(count, phase, items);

  useEffect(() => {
    // Fetch the next data
    if (phase === "fetch") {
      if (count === 3) {
        return;
      }

      const timeoutId = setTimeout(async () => {
        const updatedItems = await updateItems(count, items, setItems);
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
      const finished = isAnimationFinished(items);

      console.log("is animation finished??", finished);

      // If all items finished animation
      if (finished) {
        setPhase("done");
      }
      // setPhase("done");
    }
  }, [phase, items, count]);

  useEffect(() => {
    if (phase === "done") {
      console.log(count, "done previous items", items);
      const updatedItems = transitionToNext(items);
      setItems(updatedItems);
      console.log(count, "done updated items", updatedItems);

      setPhase("stop");
      setCount(incrementCount(count));
    }
  }, [phase, items, count]);

  return <RankingPanelLayout items={items} />;
}
