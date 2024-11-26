import Image from "next/image";
import styles from "./RankingItem.module.css";
import { Roboto_Mono } from "next/font/google";
import { useEffect, useRef, useState } from "react";

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
  retired?: boolean;
}

export type RankingItemProps = Props;

const intervalFormatter = new Intl.NumberFormat("en", {
  minimumFractionDigits: 4,
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
});

function calcStyle(
  currentRank: number,
  nextRank: number,
  boundingHeight: number
) {
  const rankDiff = nextRank - currentRank;
  if (rankDiff === 0) {
    return undefined;
  }

  const Ydiff = boundingHeight * rankDiff;
  const styles = { transform: `translateY(${Ydiff.toFixed(2)}px)` };

  return styles;
}

export function RankingItem(props: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [boundingHeight, setBoundingHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      setBoundingHeight(ref.current.getBoundingClientRect().height);
    }
  }, []);

  return (
    <div
      ref={ref}
      className={styles.component}
      style={
        props.next &&
        calcStyle(props.ranking, props.next.ranking, boundingHeight)
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
