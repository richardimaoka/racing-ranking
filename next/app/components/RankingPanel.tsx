import { RankingItem } from "./RankingItem";
import styles from "./RankingPanel.module.css";

export function RankingPanel() {
  const items = [
    {
      ranking: 1,
      name: "S. Austin",
      team: "H",
      teamIconPath: "/images/H.png",
      change: "",
      fastest: "",
    },
    {
      ranking: 2,
      name: "S. Rene",
      team: "H",
      teamIconPath: "/images/H.png",
      interval: 7.999,
      change: "",
      fastest: "",
    },
    {
      ranking: 3,
      name: "A. Fons",
      team: "5",
      teamIconPath: "/images/5.png",
      interval: 2.345,
      change: "",
      fastest: "",
    },
    {
      ranking: 4,
      name: "M. Kristian",
      team: "P",
      teamIconPath: "/images/P.png",
      interval: 3.146,
      change: "",
      fastest: "",
    },
    {
      ranking: 5,
      name: "K. Maik",
      team: "5",
      teamIconPath: "/images/5.png",
      interval: 0.15,
      change: "",
      fastest: "",
    },
    {
      ranking: 6,
      name: "G. Freddie",
      team: "D",
      teamIconPath: "/images/D.png",
      interval: 8.557,
      change: "",
      fastest: "",
    },
    {
      ranking: 7,
      name: "R. Mateus",
      team: "t",
      teamIconPath: "/images/t.png",
      interval: 9.655,
      change: "",
      fastest: "",
    },
    {
      ranking: 8,
      name: "R. Miguel",
      team: "t",
      teamIconPath: "/images/t.png",
      interval: 13.452,
      change: "",
      fastest: "",
    },
    {
      ranking: 9,
      name: "S. Wiktor",
      team: "D",
      teamIconPath: "/images/D.png",
      interval: 0.879,
      change: "",
      fastest: "",
    },
    {
      ranking: 10,
      name: "O. Odín",
      team: "P",
      teamIconPath: "/images/P.png",
      interval: 9.657,
      change: "",
      fastest: "",
    },
    {
      ranking: 11,
      name: "F. Tain",
      team: "5",
      teamIconPath: "/images/5.png",
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
          team={x.team}
          teamIconPath={x.teamIconPath}
          name={x.name}
          ranking={x.ranking}
          interval={x.interval}
        />
      ))}
    </div>
  );
}
