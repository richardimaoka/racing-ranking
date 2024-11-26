import { ReactNode, useEffect, useRef, useState } from "react";
import styles from "./ShrinkItem.module.css";

type Props = {
  children: ReactNode;
};

type AnimationPhase = "pre" | "ready" | "animating" | "done";

export function ShrinkItem(props: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const [phase, setPhase] = useState<AnimationPhase>("pre");

  console.log("ShrinkItem", phase, height);

  useEffect(() => {
    if (ref.current) {
      setHeight(ref.current.getBoundingClientRect().height);
    }
  }, []);

  useEffect(() => {
    if (phase === "pre" && height > 0) {
      setPhase("ready");
    } else if (phase === "ready") {
      // without settimeout, the height doesn't animate but immediately becomes 0
      const timeoutId = setTimeout(async () => {
        setPhase("animating");
      }, 10);
      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [phase, height]);

  function transitionToDone() {
    setPhase("done");
  }

  function calcStyle() {
    switch (phase) {
      case "pre":
        return undefined;
      case "ready":
        return { height: height };
      case "animating":
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
      onTransitionEnd={transitionToDone}
    >
      {props.children}
    </div>
  );
}
