"use client";

import { useEffect, useState } from "react";
import { RankingItemProps } from "./item/itemProps";
import { RankingRetirement } from "./listing/RankingRetirement";
import { RankingPanelLayout } from "./listing/RankingPanelLayout";
import { RankingPitIn } from "./listing/RankingPitIn";
import { RankingShuffle } from "./listing/RankingShuffle";
import { RankingUpdateItems } from "./listing/RankingUpdateItems";
import {
  skipPitInPhase,
  skipRetirementPhase,
  skipShufflePhase,
} from "./listing/listing";

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
  const [currentItems, setCurrentItems] = useState(props.initialItems);
  const [nextItems, setNextItems] = useState([]);

  console.log("RankingPanelState", phase, currentItems);

  useEffect(() => {
    if (phase === "fetch") {
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
  }, [count, currentItems, nextItems, phase]);

  switch (phase) {
    case "fetch":
      return <RankingPanelLayout items={currentItems} />;
    case "retire":
      if (skipRetirementPhase(nextItems)) {
        // https://react.dev/reference/react/useState
        //   Calling the set function during rendering is only allowed from within the currently rendering component.
        //   React will discard its output and immediately attempt to render it again with the new state.
        console.log("RankingPanelState skip the retirement phase");
        setPhase("pit in");
      }

      return (
        <RankingRetirement
          currentItems={currentItems}
          nextItems={nextItems}
          onAnimationDone={(items) => {
            setCurrentItems(items);
            setPhase("pit in");
          }}
        />
      );
    case "pit in":
      if (skipPitInPhase(nextItems)) {
        // https://react.dev/reference/react/useState
        //   Calling the set function during rendering is only allowed from within the currently rendering component.
        //   React will discard its output and immediately attempt to render it again with the new state.
        console.log("RankingPanelState skip the pit in phase");
        setPhase("shuffle");
      }

      return (
        <RankingPitIn
          currentItems={currentItems}
          nextItems={nextItems}
          onAnimationDone={(items) => {
            setCurrentItems(items);
            setPhase("shuffle");
          }}
        />
      );
    case "shuffle":
      if (skipShufflePhase(currentItems, nextItems)) {
        // https://react.dev/reference/react/useState
        //   Calling the set function during rendering is only allowed from within the currently rendering component.
        //   React will discard its output and immediately attempt to render it again with the new state.
        console.log("RankingPanelState skip the shuffle phase");
        setPhase("value change");
      }

      return (
        <RankingShuffle
          currentItems={currentItems}
          nextItems={nextItems}
          onAnimationDone={(items) => {
            setCurrentItems(items);
            setPhase("value change");
          }}
        />
      );
    case "value change":
      return (
        <RankingUpdateItems
          currentItems={currentItems}
          nextItems={nextItems}
          onAnimationDone={(items) => {
            setCurrentItems(items);
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
