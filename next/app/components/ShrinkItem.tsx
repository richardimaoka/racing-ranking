import { ReactNode, useEffect, useRef, useState } from "react";
import styles from "./ShrinkItem.module.css";

type Props = {
  children: ReactNode;
};

export function ShrinkItem(props: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  console.log("ShrinkItem", height);

  useEffect(() => {
    if (ref.current) {
      setHeight(ref.current.getBoundingClientRect().height);
    }
  }, []);

  return (
    <div
      ref={ref}
      style={height > 0 ? { height: 0 } : undefined}
      className={styles.component}
    >
      {props.children}
    </div>
  );
}
