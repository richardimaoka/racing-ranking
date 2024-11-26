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

type AnimationPhase = "fetch" | "retire"; //| "pit in";

export function RankingPanelState(props: Props) {
  const [count, setCount] = useState(2); //2 = next count
  const [phase, setPhase] = useState<AnimationPhase>("fetch");
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
    switch (phase) {
      case "fetch":
        if (count === 2) {
          // Fetch the next data
          const timeoutId = setTimeout(async () => {
            const updatedItems = await updateItems(count);
            setNextItems(updatedItems);
            setCount(incrementCount(count));
            setPhase("retire");
          }, 1000);

          return () => {
            clearTimeout(timeoutId);
          };
        }
        break;
      case "retire":
        break;
      default:
        //https://www.typescriptlang.org/docs/handbook/2/narrowing.html#exhaustiveness-checking
        const _exhaustiveCheck: never = phase;
        return _exhaustiveCheck;
    }
  }, [count, items, phase]);

  switch (phase) {
    case "fetch":
      return <RankingPanelLayout items={items} />;
    case "retire":
      return <RankingRetirement currentItems={items} nextItems={nextItems} />;
    default:
      //https://www.typescriptlang.org/docs/handbook/2/narrowing.html#exhaustiveness-checking
      const _exhaustiveCheck: never = phase;
      return _exhaustiveCheck;
  }
}
