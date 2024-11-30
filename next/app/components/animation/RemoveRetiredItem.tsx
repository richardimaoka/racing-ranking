import { ReactNode, useEffect, useRef, useState } from "react";
import styles from "./RemoveRetiredItem.module.css";

type Props = {
  children: ReactNode;
  onHeightCalculated?: (height: number) => void;
  onAnimationDone?: () => void;
};

type AnimationPhase = "calc height" | "show cover" | "shrink" | "done";

export function RemoveRetiredItem(props: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const [phase, setPhase] = useState<AnimationPhase>("calc height");

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
    if (phase === "calc height" && height !== 0) {
      if (onHeightCalculated) {
        onHeightCalculated(height);
      }
      setPhase("show cover");
    }
  }, [height, onHeightCalculated, phase]);

  switch (phase) {
    case "calc height":
      return (
        <div ref={ref} className={styles.component}>
          {props.children}
        </div>
      );
    case "show cover":
      return (
        <div style={{ height: height }} className={styles.component}>
          {props.children}
          <div
            className={styles.cover + " " + styles.appear}
            onAnimationEnd={() => setPhase("shrink")}
          >
            RETIRED
          </div>
        </div>
      );
    case "shrink":
      return (
        <div
          style={{
            // Important in the previous phase to set the height non-zero,
            // then set the height to 0 in this phase
            height: 0,
          }}
          className={styles.component}
        >
          {props.children}
          <div className={styles.cover + " " + styles.opacity09}>RETIRED</div>
        </div>
      );
    case "done":
      return (
        <div
          style={{ height: 0 }}
          className={styles.component}
          onTransitionEnd={() => {
            if (onAnimationDone) {
              onAnimationDone();
            }
            setPhase("done");
          }}
        >
          {props.children}
        </div>
      );
    default:
      const _exhaustiveCheck: never = phase;
      return _exhaustiveCheck;
  }
}
