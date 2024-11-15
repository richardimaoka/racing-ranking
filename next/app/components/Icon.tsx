import Image from "next/image";
import styles from "./Icon.module.css";

export type IconName = "5" | "atmark" | "D" | "F" | "H" | "P" | "t";

interface Props {
  name: string;
}

export function Icon(props: Props): JSX.Element {
  switch (props.name) {
    case "5":
      return (
        <Image className={styles.image} src={"/images5.png"} alt={"5 icon"} />
      );
    case "atmark":
      return (
        <Image
          className={styles.image}
          src={"/images/atmark.png"}
          alt={"atmark icon"}
        />
      );
    case "D":
      return (
        <Image className={styles.image} src={"/imagesD.png"} alt={"D icon"} />
      );
    case "F":
      return (
        <Image className={styles.image} src={"/imagesF.png"} alt={"F icon"} />
      );
    case "H":
      return (
        <Image className={styles.image} src={"/imagesH.png"} alt={"H icon"} />
      );
    case "P":
      return (
        <Image className={styles.image} src={"/imagesP.png"} alt={"P icon"} />
      );
    case "t":
      return (
        <Image className={styles.image} src={"/imagest.png"} alt={"t icon"} />
      );
  }

  return <Image className={styles.image} src={"/imagest.png"} alt={"t icon"} />;
}
