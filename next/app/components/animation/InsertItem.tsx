import { ReactNode, useEffect, useState } from "react";
import styles from "./InsertItem.module.css";

type Props = {
  height: number;
  children: ReactNode;
  onAnimationDone?: () => void;
};

type AnimationPhase = "pre" | "slide" | "callback" | "done";

export function InsertItem(props: Props) {
  const [phase, setPhase] = useState<AnimationPhase>("pre");

  const onAnimationDone = props.onAnimationDone;

  useEffect(() => {
    switch (phase) {
      case "pre":
        // without setTimeout, the height doesn't animate but immediately becomes 0
        const timeoutId = setTimeout(async () => {
          setPhase("slide");
        }, 10);
        return () => {
          clearTimeout(timeoutId);
        };
      case "slide":
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
  }, [phase, onAnimationDone]);

  function calcStyle() {
    switch (phase) {
      case "pre":
        return { height: 0 };
      case "slide":
        return { height: props.height };
      case "callback":
        return { height: props.height };
      case "done":
        return { height: props.height };
      default:
        const _exhaustiveCheck: never = phase;
        return _exhaustiveCheck;
    }
  }

  function calcClassName() {
    switch (phase) {
      case "pre":
        return styles.component + " " + styles.slideInPre;
      case "slide":
        return styles.component + " " + styles.slideInPost;
      case "callback":
        return styles.component;
      case "done":
        return styles.component;
      default:
        const _exhaustiveCheck: never = phase;
        return _exhaustiveCheck;
    }
  }

  function onTransitionEnd() {
    setPhase("callback");
  }

  return (
    <div
      style={calcStyle()}
      className={calcClassName()}
      onTransitionEnd={onTransitionEnd}
    >
      {props.children}
    </div>
  );
}
