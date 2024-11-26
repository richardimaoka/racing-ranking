import { RankingItemProps } from "../item/RankingItem";

export function augmentRetirementInfo(
  currentItems: RankingItemProps[],
  nextItems: RankingItemProps[]
): RankingItemProps[] {
  return currentItems.map((current) => {
    const next = nextItems.find((n) => n.name === current.name);
    return {
      ...current,
      retired: next?.retired,
    };
  });
}

export function moveRetiredItemsToBottom(
  currentItems: RankingItemProps[],
  nextItems: RankingItemProps[]
): RankingItemProps[] {
  // Supposedly next items have retired items at the bottom
  return nextItems.map((next) => {
    const current = currentItems.find((c) => c.name === next.name);
    // preserve current ranking and inerval
    return {
      ...next,
      ranking: current ? current.ranking : next.ranking,
      interval: current ? current.interval : next.interval,
    };
  });
}
