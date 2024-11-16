"use client";

import { useEffect, useState } from "react";
import { RankingPanelLayout } from "./RankingPanelLayout";
import { RankingItemProps } from "./RankingItem";

interface Props {
  items: RankingItemProps[];
}

export function RankingPanelState(props: Props) {
  const maxCount = 3;
  const [count, setCount] = useState(1);
  const [items, setItems] = useState(props.items);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      const res = await fetch(`/api?count=${count}`);
      const newItems = await res.json();
      setItems(newItems);

      if (count < maxCount) {
        setCount(count + 1);
      } else {
        setCount(1);
      }
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [count]);

  return <RankingPanelLayout items={items} />;
}
