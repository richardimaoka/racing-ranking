import { readData } from "../data/data";
import { RankingPanelnner } from "./RankingPanelnner";

export async function RankingPanel() {
  const items = await readData();

  return <RankingPanelnner items={items} />;
}
