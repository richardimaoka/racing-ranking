import Image from "next/image";
import styles from "./RankingItem.module.css";
import { Roboto_Mono } from "next/font/google";

interface Props {
  team: string;
  teamIconPath: string;
  ranking: number;
  name: string;
  interval?: number;
  next?: {
    ranking: number;
    interval?: number;
    animationEnd: boolean;
    onTransitionEnd?: () => void;
  };
}

export type RankingItemProps = Props;

const intervalFormatter = new Intl.NumberFormat("en", {
  minimumFractionDigits: 4,
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
});

export function RankingItem(props: Props) {
  return (
    <div
      className={
        props.next ? `${styles.component} ${styles.next}` : styles.component
      }
      onTransitionEnd={props.next?.onTransitionEnd}
    >
      <div className={`${styles.ranking} ${robotoMono.className}`}>
        {props.ranking}
      </div>
      <Image
        className={styles.icon}
        src={props.teamIconPath}
        alt={props.team + " icon"}
        width={16}
        height={16}
      />
      <div className={styles.name}>{props.name}</div>
      {props.ranking === 1 ? (
        <div className={`${styles.interval} ${robotoMono.className}`}>
          LEADER
        </div>
      ) : (
        <div className={`${styles.interval} ${robotoMono.className}`}>
          {props.interval && "+" + intervalFormatter.format(props.interval)}
        </div>
      )}
    </div>
  );
}
