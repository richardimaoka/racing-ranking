import { ReactNode, useEffect, useRef, useState } from "react";
import styles from "./RemoveItem.module.css";

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

export function RemoveItem(props: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const [phase, setPhase] = useState<AnimationPhase>("pre");

  // Necessary useEffect, because ref is set only after the initial rendering.
  useEffect(() => {
    if (ref.current) {
      // If you dare to move this block out of useEffect, and put direclty in the component (initialization) logic, the block will never run.
      // This is because, at first, ref.current is undefined, and nothing triggers the second rendering
      setHeight(ref.current.getBoundingClientRect().height);
    }
  }, []);

  const onHeightCalculated = props.onHeightCalculated;
  const onAnimationDone = props.onAnimationDone;

  // Necessary useEffect, to avoid the following error
  // Error: Cannot update a component while rendering a different component.
  //        To locate the bad setState() call inside this component, follow the stack trace as described in
  //        https://react.dev/link/setstate-in-render
  useEffect(() => {
    if (phase === "pre" && height !== 0) {
      if (onHeightCalculated) {
        onHeightCalculated(height);
      }
      setPhase("ready");
    }
  }, [height, onHeightCalculated, phase]);

  useEffect(() => {
    switch (phase) {
      case "pre":
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
