import { RankingItemProps } from "../item/RankingItem";
import styles from "./RankingUpdateRanking.module.css";

type Props = {
  currentItems: RankingItemProps[];
  nextItems: RankingItemProps[];
  onAnimationDone?: () => void;
};

type AnimationPhase = "pre" | "";

export function RankingUpdateRanking(props: Props) {
  
  return <div className={styles.component}></div>;
}
