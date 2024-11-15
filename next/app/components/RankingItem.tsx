import Image from "next/image";
import styles from "./RankingItem.module.css";

interface Props {
  team: string;
  teamIconPath: string;
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
      <div className={styles.ranking}>{props.ranking}</div>
      <Image
        className={styles.icon}
        src={props.teamIconPath}
        alt={props.team + " icon"}
        width={16}
        height={16}
      />
      <div className={styles.name}>{props.name}</div>
      <div className={styles.interval}>
        {props.interval && intervalFormatter.format(props.interval)}
      </div>
    </div>
  );
}
