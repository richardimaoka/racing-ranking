import Image from "next/image";
import styles from "./StaticItemPitIn.module.css";
import { Roboto_Mono } from "next/font/google";

interface Props {
  team: string;
  teamIconPath: string;
  name: string;
}

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
});

export function PitInItem(props: Props) {
  return (
    <div className={styles.component}>
      <div className={`${styles.ranking} ${robotoMono.className}`}>PIT</div>
      <Image
        className={styles.icon}
        src={props.teamIconPath}
        alt={props.team + " icon"}
        width={16}
        height={16}
      />
      <div className={styles.name}>{props.name}</div>
      <div className={`${styles.interval} ${robotoMono.className}`}>IN PIT</div>
    </div>
  );
}
