import { RankingItem } from "./RankingItem";
import styles from "./RankingPanel.module.css";

export function RankingPanel() {
  const items = [
    {
      ranking: 1,
      name: "S. Austin",
      team: "H",
      change: "",
      fastest: "",
    },
    {
      ranking: 2,
      name: "S. Rene",
      team: "H",
      interval: 7.999,
      change: "",
      fastest: "",
    },
    {
      ranking: 3,
      name: "A. Fons",
      team: "A",
      interval: 2.345,
      change: "",
      fastest: "",
    },
    {
      ranking: 4,
      name: "M. Kristian",
      team: "P",
      interval: 3.146,
      change: "",
      fastest: "",
    },
    {
      ranking: 5,
      name: "K. Maik",
      team: "A",
      interval: 0.15,
      change: "",
      fastest: "",
    },
    {
      ranking: 6,
      name: "G. Freddie",
      team: "D",
      interval: 8.557,
      change: "",
      fastest: "",
    },
    {
      ranking: 7,
      name: "R. Mateus",
      team: "T",
      interval: 9.655,
      change: "",
      fastest: "",
    },
    {
      ranking: 8,
      name: "R. Miguel",
      team: "T",
      interval: 13.452,
      change: "",
      fastest: "",
    },
    {
      ranking: 9,
      name: "S. Wiktor",
      team: "D",
      interval: 0.879,
      change: "",
      fastest: "",
    },
    {
      ranking: 10,
      name: "O. Odín",
      team: "P",
      interval: 9.657,
      change: "",
      fastest: "",
    },
    {
      ranking: 11,
      name: "F. Tain",
      team: "A",
      interval: 14.548,
      change: "",
      fastest: "",
    },
  ];

  return (
    <div className={styles.component}>
      {items.map((x) => (
        <RankingItem
          key={x.name}
          name={x.name}
          ranking={x.ranking}
          interval={x.interval}
        />
      ))}
    </div>
  );
}
