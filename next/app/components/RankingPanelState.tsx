"use client";

import { useEffect, useState } from "react";
import { RankingItemProps } from "./item/RankingItem";
import { RankingRetirement } from "./listing/RankingRetirement";
import { RankingPanelLayout } from "./RankingPanelLayout";

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
  const [items] = useState(props.initialItems);
  const [nextItems, setNextItems] = useState([]);

  // useEffect(() => {
  //   // Fetch the next data
  //   const timeoutId = setTimeout(async () => {
  //     const updatedItems = await updateItems(count);
  //     setItems(updatedItems);
  //     setCount(incrementCount(count));
  //   }, 100000);

  //   return () => {
  //     clearTimeout(timeoutId);
  //   };
  // }, [count, items]);

  useEffect(() => {
    if (count === 2) {
      // Fetch the next data
      const timeoutId = setTimeout(async () => {
        const updatedItems = await updateItems(count);
        setNextItems(updatedItems);
        setCount(incrementCount(count));
      }, 1000);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [count, items]);

  if (nextItems.length === 0) {
    return <RankingPanelLayout items={items} />;
  } else {
    return <RankingRetirement currentItems={items} nextItems={nextItems} />;
  }
}
