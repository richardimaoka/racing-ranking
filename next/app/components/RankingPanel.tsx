import { RankingPanelnner } from "./RankingPanelnner";

export async function RankingPanel() {
  const res = await fetch("http://localhost:3000/api");
  const items = await res.json();

  return <RankingPanelnner items={items} />;
}
