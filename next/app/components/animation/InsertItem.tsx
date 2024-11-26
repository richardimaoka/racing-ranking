import { ReactNode, useEffect, useState } from "react";
import styles from "./InsertItem.module.css";

type Props = {
  height: number;
  children: ReactNode;
};

type AnimationPhase = "pre" | "slide";

export function InsertItem(props: Props) {
  const [phase, setPhase] = useState<AnimationPhase>("pre");

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
      default:
        const _exhaustiveCheck: never = phase;
        return _exhaustiveCheck;
    }
  }, [phase]);

  function calcStyle() {
    switch (phase) {
      case "pre":
        return { height: 0 };
      case "slide":
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
      default:
        const _exhaustiveCheck: never = phase;
        return _exhaustiveCheck;
    }
  }

  return (
    <div style={calcStyle()} className={calcClassName()}>
      {props.children}
    </div>
  );
}
