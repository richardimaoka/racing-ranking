import { ReactNode, useEffect, useRef, useState } from "react";
import styles from "./ShuffleItem.module.css";

type Props = {
  children: ReactNode;
  currentRank: number;
  nextRank: number;
  onAnimationDone?: () => void;
  name: string;
};

type AnimationPhase = "pre" | "animating" | "done callback" | "done";

function translateStyle(
  currentRank: number,
  nextRank: number,
  itemHeight: number
) {
  const rankDiff = nextRank - currentRank;
  if (rankDiff === 0) {
    return undefined;
  }

  const Ydiff = itemHeight * rankDiff;
  const styles = { transform: `translateY(${Ydiff.toFixed(0)}px)` };

  return styles;
}

export function ShuffleItem(props: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [itemHeight, setItemHeight] = useState(0);
  const [phase, setPhase] = useState<AnimationPhase>("pre");

  useEffect(() => {
    if (ref.current) {
      setItemHeight(ref.current.getBoundingClientRect().height);
    }
  }, []);

  const onAnimationDone = props.onAnimationDone;

  useEffect(() => {
    switch (phase) {
      case "pre":
        if (itemHeight > 0) {
          setPhase("animating");
        }
        return;
      case "animating":
        // do nothing - phase change will be done by onTransitionEnd event handler
        return;
      case "done callback":
        if (onAnimationDone) {
          onAnimationDone();
        }
        setPhase("done");
        return;
      case "done":
        // do nothing
        return;
      default:
        const _exhaustiveCheck: never = phase;
        return _exhaustiveCheck;
    }
  }, [phase, onAnimationDone, itemHeight]);

  function calcStyle() {
    switch (phase) {
      case "pre":
        return undefined;

      case "animating":
        console.log(
          "ShuffleItem",
          props.name,
          "curent rank = ",
          props.currentRank,
          "next rank = ",
          props.nextRank,
          translateStyle(props.currentRank, props.nextRank, itemHeight)
        );
        return translateStyle(props.currentRank, props.nextRank, itemHeight);
      case "done callback":
        return translateStyle(props.currentRank, props.nextRank, itemHeight);
      case "done":
        return translateStyle(props.currentRank, props.nextRank, itemHeight);
      default:
        const _exhaustiveCheck: never = phase;
        return _exhaustiveCheck;
    }
  }

  function onTransitionEnd() {
    setPhase("done callback");
  }

  return (
    <div
      ref={ref}
      style={calcStyle()}
      className={styles.component}
      onTransitionEnd={onTransitionEnd}
    >
      {props.children}
    </div>
  );
}
