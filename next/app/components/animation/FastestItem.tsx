import { ReactNode, useState } from "react";
import styles from "./FastestItem.module.css";

type Props = {
  children: ReactNode;
  onAnimationDone?: () => void;
};

type AnimationPhase = "animating" | "done";

export function FastestItem(props: Props) {
  const [phase, setPhase] = useState<AnimationPhase>("animating");

  const onAnimationDone = props.onAnimationDone;

  switch (phase) {
    case "animating":
      return (
        <div className={styles.component}>
          {props.children}
          <div
            className={styles.cover + " " + styles.appear}
            onAnimationEnd={() => {
              if (onAnimationDone) {
                onAnimationDone();
              }
              setPhase("done");
            }}
          >
            FASTEST
          </div>
        </div>
      );
    case "done":
      return <div className={styles.component}>{props.children}</div>;
    default:
      const _exhaustiveCheck: never = phase;
      return _exhaustiveCheck;
  }
}
