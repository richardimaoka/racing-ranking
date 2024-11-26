import { ReactNode, useEffect, useRef, useState } from "react";
import styles from "./ShrinkItem.module.css";

type Props = {
  children: ReactNode;
  onHeightCalculated?: (height: number) => void;
  onAnimationDone?: () => void;
};

type AnimationPhase =
  | "pre" //       calculate the height
  | "ready" //     trigger animation with setTimeout - without setTimeout, the height doesn't animate but immediately becomes 0
  | "animating" // animation starts
  | "callback" //  call the callback only once
  | "done"; //     done everything

export function ShrinkItem(props: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const [phase, setPhase] = useState<AnimationPhase>("pre");

  useEffect(() => {
    if (ref.current) {
      setHeight(ref.current.getBoundingClientRect().height);
    }
  }, []);

  const onHeightCalculated = props.onHeightCalculated;
  const onAnimationDone = props.onAnimationDone;

  useEffect(() => {
    switch (phase) {
      case "pre":
        if (height > 0) {
          if (onHeightCalculated) {
            onHeightCalculated(height);
          }
          setPhase("ready");
        }
        return;
      case "ready":
        // without setTimeout, the height doesn't animate but immediately becomes 0
        const timeoutId = setTimeout(async () => {
          setPhase("animating");
        }, 10);
        return () => {
          clearTimeout(timeoutId);
        };
      case "animating":
        // do nothing - phase change will be done by onTransitionEnd event handler
        return;
      case "callback":
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
  }, [phase, height, onHeightCalculated, onAnimationDone]);

  function onTransitionEnd() {
    setPhase("callback");
  }

  function calcStyle() {
    switch (phase) {
      case "pre":
        return undefined;
      case "ready":
        return { height: height };
      case "animating":
        return { height: 0 };
      case "callback":
        return { height: 0 };
      case "done":
        return { height: 0 };
      default:
        const _exhaustiveCheck: never = phase;
        return _exhaustiveCheck;
    }
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
