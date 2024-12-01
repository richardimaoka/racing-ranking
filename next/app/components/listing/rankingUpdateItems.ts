import { RankingItemProps } from "../item/RankingItem";
import { movePitInItemsToBottom } from "./rankingPitInListing";

export function augmentFastestInfo(
  currentItems: RankingItemProps[],
  nextItems: RankingItemProps[]
): RankingItemProps[] {
  const items = movePitInItemsToBottom(currentItems, nextItems);

  return items.map((item) => {
    const next = nextItems.find((n) => n.name === item.name);
    return {
      ...item,
      retired: next?.retired,
      pitIn: next?.pitIn,
      fastest: next?.fastest,
    };
  });
}

export function augmentUpdateInfo(
  currentItems: RankingItemProps[],
  nextItems: RankingItemProps[]
): RankingItemProps[] {
  const items = movePitInItemsToBottom(currentItems, nextItems);

  return items.map((item) => {
    const next = nextItems.find((n) => n.name === item.name);
    return {
      ...item,
      retired: next?.retired,
      pitIn: next?.pitIn,
      next: next
        ? {
            ranking: next.ranking,
            interval: next.interval,
          }
        : undefined,
    };
  });
}
