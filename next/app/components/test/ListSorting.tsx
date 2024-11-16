"use client";

import { useEffect, useState } from "react";
import styles from "./ListSorting.module.css";
import { ListItem } from "./ListItem";

export function ListSorting() {
  const [data, setData] = useState([
    { n: 1, state: "static" },
    { n: 2, state: "static" },
    { n: 3, state: "static" },
    { n: 4, state: "static" },
    { n: 5, state: "static" },
  ]);

  console.log("ListSorting rendering", data);

  useEffect(() => {
    console.log("setting data after initial rendering");
    setData([
      { n: 1, state: "static" },
      { n: 2, state: "static" },
      { n: 3, state: "animate" },
      { n: 4, state: "static" },
      { n: 5, state: "animate" },
    ]);
  }, []);

  function setStatic(n: number) {
    console.log("setStatic", n);
    const updatedData = [...data];
    const dataIndex = updatedData.findIndex((d) => d.n === n);
    if (dataIndex > -1) {
      updatedData[dataIndex].state = "static";
      setData(updatedData);
    }
  }

  return (
    <div className={styles.component}>
      {data.map((x) =>
        x.state === "animate" ? (
          <ListItem
            key={x.n}
            className={styles.animate}
            onTransitionEnd={() => setStatic(x.n)}
          >
            {x.n}
          </ListItem>
        ) : (
          <ListItem key={x.n}>{x.n}</ListItem>
        )
      )}
    </div>
  );
}
