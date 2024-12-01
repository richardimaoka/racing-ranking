"use client";

import { useEffect, useState } from "react";
import { RankingItemProps } from "./item/RankingItem";
import { RankingRetirement } from "./listing/RankingRetirement";
import { RankingPanelLayout } from "./RankingPanelLayout";
import { RankingPitIn } from "./listing/RankingPitIn";
import { skipRetirementPhase } from "./listing/rankingRetirementListing";
import { skipPitInPhase } from "./listing/rankingPitInListing";
import { RankingShuffle } from "./listing/RankingShuffle";
import { RankingUpdateItems } from "./listing/RankingUpdateItems";

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

type AnimationPhase =
  | "fetch"
  | "retire"
  | "pit in"
  | "shuffle"
  | "value change";

export function RankingPanelState(props: Props) {
  const [count, setCount] = useState(2); //2 = next count
  const [phase, setPhase] = useState<AnimationPhase>("fetch");
  const [items] = useState(props.initialItems);
  const [nextItems, setNextItems] = useState([]);

  console.log("RankingPanelState", phase, items);

  useEffect(() => {
    switch (phase) {
      case "fetch":
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
      case "retire":
        if (skipRetirementPhase(nextItems)) {
          setPhase("pit in");
        }
        break;
      case "pit in":
        if (skipPitInPhase(nextItems)) {
          setPhase("value change");
        }
        break;
      case "shuffle":
        // if (skipPitInPhase(nextItems)) {
        //   setPhase("value change");
        // }
        break;
      case "value change":
        break;
      default:
        //https://www.typescriptlang.org/docs/handbook/2/narrowing.html#exhaustiveness-checking
        const _exhaustiveCheck: never = phase;
        return _exhaustiveCheck;
    }
  }, [count, items, nextItems, phase]);

  switch (phase) {
    case "fetch":
      return <RankingPanelLayout items={items} />;
    case "retire":
      return (
        <RankingRetirement
          currentItems={items}
          nextItems={nextItems}
          onAnimationDone={() => {
            setPhase("pit in");
          }}
        />
      );
    case "pit in":
      return (
        <RankingPitIn
          currentItems={items}
          nextItems={nextItems}
          onAnimationDone={() => {
            setPhase("value change");
          }}
        />
      );
    case "shuffle":
      return (
        <RankingShuffle
          currentItems={items}
          nextItems={nextItems}
          onAnimationDone={() => {
            // setPhase("rank update");
          }}
        />
      );
    case "value change":
      return (
        <RankingUpdateItems
          currentItems={items}
          nextItems={nextItems}
          onAnimationDone={() => {
            // setPhase("rank update");
          }}
        />
      );
    default:
      //https://www.typescriptlang.org/docs/handbook/2/narrowing.html#exhaustiveness-checking
      const _exhaustiveCheck: never = phase;
      return _exhaustiveCheck;
  }
}
