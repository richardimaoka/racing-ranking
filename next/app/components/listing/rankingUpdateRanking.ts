import { RankingItemProps } from "../item/RankingItem";
import { movePitInItemsToBottom } from "./rankingPitInListing";

export function updateRanking(
  currentItems: RankingItemProps[],
  nextItems: RankingItemProps[]
): RankingItemProps[] {
  const items = movePitInItemsToBottom(currentItems, nextItems);

  return items.map((item, index) => {
    return {
      ...item,
      ranking: index + 1,
    };
  });
}
