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
  skipValueChangePhaseFake,
  skipValueChangePhase,
} from "./listing/listing";

interface Props {
  initialItems: RankingItemProps[];
}

function incrementCount(count: number, maxCount: number) {
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
  const [nextCount, setNextCount] = useState(2);
  const [phase, setPhase] = useState<AnimationPhase>("fetch");
  const [currentItems, setCurrentItems] = useState(props.initialItems);
  const [nextItems, setNextItems] = useState([]);

  console.log("RankingPanelState", phase, nextCount, currentItems);

  useEffect(() => {
    const maxCount = 10;
    if (phase === "fetch") {
      if (nextItems.length > 0) {
        setCurrentItems(nextItems);
      }

      // Fetch the next data
      const timeoutId = setTimeout(async () => {
        const updatedItems = await updateItems(nextCount);
        setNextItems(updatedItems);
        setNextCount(incrementCount(nextCount, maxCount));
        setPhase("retire");
      }, 1000);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [nextCount, currentItems, nextItems, phase]);

  switch (phase) {
    case "fetch":
      return <RankingPanelLayout items={currentItems} />;
    case "retire":
      if (skipRetirementPhase(nextItems)) {
        console.log("skipRetirementPhase");
        // https://react.dev/reference/react/useState
        //   Calling the set function during rendering is only allowed from within the currently rendering component.
        //   React will discard its output and immediately attempt to render it again with the new state.
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
        console.log("skipPitInPhase");
        // https://react.dev/reference/react/useState
        //   Calling the set function during rendering is only allowed from within the currently rendering component.
        //   React will discard its output and immediately attempt to render it again with the new state.
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
        console.log("skipShufflePhase");
        // https://react.dev/reference/react/useState
        //   Calling the set function during rendering is only allowed from within the currently rendering component.
        //   React will discard its output and immediately attempt to render it again with the new state.
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
      if (skipValueChangePhaseFake(nextCount)) {
        console.log("skipValueChangePhase");
        // https://react.dev/reference/react/useState
        //   Calling the set function during rendering is only allowed from within the currently rendering component.
        //   React will discard its output and immediately attempt to render it again with the new state.
        setPhase("fetch");
      }
      return (
        <RankingUpdateItems
          currentItems={currentItems}
          nextItems={nextItems}
          onAnimationDone={(items) => {
            setCurrentItems(items);
            setPhase("fetch");
          }}
        />
      );
    default:
      //https://www.typescriptlang.org/docs/handbook/2/narrowing.html#exhaustiveness-checking
      const _exhaustiveCheck: never = phase;
      return _exhaustiveCheck;
  }
}
