import { RankingItemProps } from "../item/RankingItem";
import { updateRanking } from "./rankingUpdateRanking";

export function augmentShuffleInfo(
  currentItems: RankingItemProps[],
  nextItems: RankingItemProps[]
): RankingItemProps[] {
  const items = updateRanking(currentItems, nextItems);

  return items.map((item) => {
    const next = nextItems.find((n) => n.name === item.name);
    return {
      ...item,
      next: next
        ? {
            ranking: next.ranking,
          }
        : undefined,
    };
  });
}

export function afterShuffle(
  currentItems: RankingItemProps[],
  nextItems: RankingItemProps[]
): RankingItemProps[] {
  return nextItems.map((n) => {
    const current = currentItems.find((c) => c.name === n.name);
    return {
      ...n,
      interval: current?.interval,
    };
  });
}