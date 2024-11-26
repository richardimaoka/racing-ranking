import Image from "next/image";
import styles from "./RetiredItem.module.css";
import { Roboto_Mono } from "next/font/google";

interface Props {
  team: string;
  teamIconPath: string;
  name: string;
}

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
});

export function RetiredItem(props: Props) {
  return (
    <div className={styles.component}>
      <div className={`${styles.ranking} ${robotoMono.className}`}>OUT</div>
      <Image
        className={styles.icon}
        src={props.teamIconPath}
        alt={props.team + " icon"}
        width={16}
        height={16}
      />
      <div className={styles.name}>{props.name}</div>
      <div className={`${styles.interval} ${robotoMono.className}`}>
        RETIRED
      </div>
    </div>
  );
}
