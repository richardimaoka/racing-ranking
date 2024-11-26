import { ReactNode } from "react";
import styles from "./InsertItem.module.css";

type Props = {
  height: number;
  children: ReactNode;
};

export function InsertItem(props: Props) {
  return <div className={styles.component}>{props.children}</div>;
}
