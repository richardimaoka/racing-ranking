import Image from "next/image";
import styles from "./UpdateItem.module.css";
import { Roboto_Mono } from "next/font/google";
import { useEffect, useState } from "react";

interface Props {
  team: string;
  teamIconPath: string;
  currentRanking: number;
  nextRanking?: number;
  name: string;
  currentInterval?: number;
  nextInterval?: number;
  onAnimationDone?: () => void;
}

const intervalFormatter = new Intl.NumberFormat("en", {
  minimumFractionDigits: 4,
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
});

function interval(
  currentInterval: number | undefined,
  nextInterval: number | undefined
): string {
  if (nextInterval) {
    return "+" + intervalFormatter.format(nextInterval);
  } else if (currentInterval) {
    return "+" + intervalFormatter.format(currentInterval);
  }
  return " ";
}

export function UpdateItem(props: Props) {
  const highlightRanking = props.currentRanking !== props.nextRanking;
  const highlightInterval = props.currentInterval !== props.nextInterval;

  const [doneRankingAnimation, setDoneRankingAnimation] = useState(
    !highlightRanking
  );
  const [doneIntervalAnimation, setDoneIntervalAnimation] = useState(
    !highlightInterval
  );

  // useEffect is necessary:
  //   https://react.dev/reference/react/useState#setstate-caveats
  //   Calling the set function during rendering is only allowed from within the currently rendering component.
  useEffect(() => {
    const animationRequired = highlightRanking || highlightInterval;
    const doneAnimation = doneRankingAnimation && doneIntervalAnimation;
    if (animationRequired && doneAnimation) {
      if (props.onAnimationDone) {
        props.onAnimationDone();
      }
    }
  }, [
    doneIntervalAnimation,
    doneRankingAnimation,
    highlightInterval,
    highlightRanking,
    props,
  ]);

  return (
    <div className={styles.component}>
      <div
        className={
          styles.ranking +
          " " +
          robotoMono.className +
          (highlightRanking ? " " + styles.highlight : "")
        }
        onAnimationEnd={() => {
          setDoneRankingAnimation(true);
        }}
      >
        {props.nextRanking}
      </div>
      <Image
        className={styles.icon}
        src={props.teamIconPath}
        alt={props.team + " icon"}
        width={16}
        height={16}
      />
      <div className={styles.name}>{props.name}</div>
      {props.nextRanking === 1 ? (
        <div
          className={
            styles.interval +
            " " +
            robotoMono.className +
            (highlightInterval ? " " + styles.highlight : "")
          }
          onAnimationEnd={() => {
            setDoneIntervalAnimation(true);
          }}
        >
          LEADER
        </div>
      ) : (
        <div
          className={
            styles.interval +
            " " +
            robotoMono.className +
            (highlightInterval ? " " + styles.highlight : "")
          }
          onAnimationEnd={() => {
            setDoneIntervalAnimation(true);
          }}
        >
          {interval(props.currentInterval, props.nextInterval)}
        </div>
      )}
    </div>
  );
}
