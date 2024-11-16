import { RankingPanelState } from "./RankingPanelState";

export async function RankingPanel() {
  const res = await fetch("http://localhost:3000/api");
  const items = await res.json();

  return <RankingPanelState items={items} />;
}
