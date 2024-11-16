"use client";

import { useEffect, useState } from "react";
import { RankingPanelLayout } from "./RankingPanelLayout";
import { RankingItemProps } from "./RankingItem";

interface Props {
  initialItems: RankingItemProps[];
}

function constructItems(
  currentItems: RankingItemProps[],
  nextItems: RankingItemProps[]
): RankingItemProps[] {
  return nextItems;
}

function incrementCount(count: number) {
  const maxCount = 3;
  if (count < maxCount) {
    return count + 1;
  } else {
    return 1;
  }
}

export function RankingPanelState(props: Props) {
  const [count, setCount] = useState(1);

  const initialItems = constructItems(props.initialItems, props.initialItems);
  const [items, setItems] = useState(initialItems);

  // Fetch the next data
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      const res = await fetch(`/api?count=${count}`);
      const newItems = await res.json();
      setItems(constructItems(items, newItems));

      setCount(incrementCount(count));
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [count, items]);

  return <RankingPanelLayout items={items} />;
}
