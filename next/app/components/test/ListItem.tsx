import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  onTransitionEnd?: () => void;
}

export function ListItem(props: Props) {
  console.log("ListItem rendering", props.children);
  return (
    <div className={props.className} onTransitionEnd={props.onTransitionEnd}>
      {props.children}
    </div>
  );
}
