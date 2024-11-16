import { readFile } from "node:fs/promises";

interface RankingItemProps {
  team: string;
  teamIconPath: string;
  ranking: number;
  name: string;
  interval?: number;
}

let currentIndex = 1;

export async function GET() {
  const fileContents = await readFile(
    process.cwd() + `/app/api/data/${currentIndex}.json`,
    "utf8"
  );
  
  if (currentIndex === 1) {
    currentIndex = 2;
  } else if (currentIndex === 2) {
    currentIndex = 1;
  }

  console.log("current index", currentIndex);

  const items = JSON.parse(fileContents) as RankingItemProps[];

  return Response.json(items);
}
