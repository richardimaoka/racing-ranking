"use client";

import { useEffect, useState } from "react";
import { RankingPanelLayout } from "./RankingPanelLayout";
import { RankingItemProps } from "./RankingItem";
import { RankingRetirement } from "./RankingRetirement";

interface Props {
  initialItems: RankingItemProps[];
}

function incrementCount(count: number) {
  const maxCount = 3;
  if (count < maxCount) {
    return count + 1;
  } else {
    return 1;
  }
}

async function updateItems(count: number) {
  const res = await fetch(`/api?count=${count}`);
  const nextItems = await res.json();
  return nextItems;
}

export function RankingPanelState(props: Props) {
  const [count, setCount] = useState(2); //2 = next count
  const [items, setItems] = useState(props.initialItems);

  useEffect(() => {
    // Fetch the next data
    const timeoutId = setTimeout(async () => {
      const updatedItems = await updateItems(count);
      setItems(updatedItems);
      setCount(incrementCount(count));
    }, 100000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [count, items]);

  return <RankingRetirement items={items} />;
}
