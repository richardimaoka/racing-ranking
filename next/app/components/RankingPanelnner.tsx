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
    const timeoutId = setTimeout(() => {
      console.log("timeout func");
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return <RankingPanelLayout items={items} />;
}
