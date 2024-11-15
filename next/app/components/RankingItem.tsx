import styles from "./RankingItem.module.css";

interface Props {
  ranking: number;
  name: string;
  interval?: number;
}

const intervalFormatter = new Intl.NumberFormat("en", {
  minimumFractionDigits: 4,
});

export function RankingItem(props: Props) {
  return (
    <div className={styles.component}>
      <div>{props.ranking}</div>
      <div>{props.name}</div>
      <div>{props.interval && intervalFormatter.format(props.interval)}</div>
    </div>
  );
}
