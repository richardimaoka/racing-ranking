import { NextRequest } from "next/server";
import { readFile } from "node:fs/promises";

interface RankingItemProps {
  team: string;
  teamIconPath: string;
  ranking: number;
  name: string;
  interval?: number;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const countStr = searchParams.get("count");
  const count = countStr ? Number(countStr) : 1;

  const fileContents = await readFile(
    process.cwd() + `/app/api/data/${count}.json`,
    "utf8"
  );

  console.log("count", count);

  const items = JSON.parse(fileContents) as RankingItemProps[];

  return Response.json(items);
}
