import { readFile } from "node:fs/promises";

interface RankingItemProps {
  team: string;
  teamIconPath: string;
  ranking: number;
  name: string;
  interval?: number;
}

const currentIndex = 1;

export async function readData(): Promise<RankingItemProps[]> {
  const fileContents = await readFile(
    process.cwd() + `/app/data/${currentIndex}.json`,
    "utf8"
  );

  const items = JSON.parse(fileContents);

  return items as RankingItemProps[];
}
