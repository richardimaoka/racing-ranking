import { ReactNode, useEffect, useRef, useState } from "react";
import styles from "./ShrinkItem.module.css";

type Props = {
  children: ReactNode;
  onDoneAnimation?: () => void;
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

  const onDoneAnimation = props.onDoneAnimation;

  useEffect(() => {
    if (phase === "pre" && height > 0) {
      setPhase("ready");
    } else if (phase === "ready") {
      // without setTimeout, the height doesn't animate but immediately becomes 0
      const timeoutId = setTimeout(async () => {
        setPhase("animating");
      }, 10);
      return () => {
        clearTimeout(timeoutId);
      };
    } else if (phase === "callback") {
      if (onDoneAnimation) {
        onDoneAnimation();
      }
      setPhase("done");
    }
  }, [phase, height, onDoneAnimation]);

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
