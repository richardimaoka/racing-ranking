"use client";

import { useEffect, useState } from "react";
import { RankingPanelLayout } from "./RankingPanelLayout";
import { RankingItemProps } from "./RankingItem";

interface Props {
  items: RankingItemProps[];
}

export function RankingPanelnner(props: Props) {
  const [items, setItems] = useState(props.items);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      const res = await fetch("http://localhost:3000/api");
      const newItems = await res.json();
      setItems(newItems);
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [items]);

  return <RankingPanelLayout items={items} />;
}
