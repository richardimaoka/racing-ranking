import Image from "next/image";
import { RankingPanel } from "./components/RankingPanel";
import styles from "./page.module.css";
import bgFile from "./bg/car-racing-8728909_1280.jpg";
import { ListSorting } from "./components/test/ListSorting";

export default function Home() {
  return (
    <div className={styles.page}>
      <ListSorting />
      {/* <Image
        className={styles.background}
        src={bgFile}
        alt="background image"
      ></Image>
      <RankingPanel /> */}
    </div>
  );
}
