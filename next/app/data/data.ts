import { readFile } from "node:fs/promises";

interface RankingItemProps {
  team: string;
  teamIconPath: string;
  ranking: number;
  name: string;
  interval?: number;
}

export async function readData(): Promise<RankingItemProps[]> {
  const fileContents = await readFile(
    process.cwd() + "/app/data/1.json",
    "utf8"
  );

  const items = JSON.parse(fileContents);

  return items as RankingItemProps[];
}
