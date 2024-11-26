import { RankingItemProps } from "../item/RankingItem";
import { moveRetiredItemsToBottom } from "./rankingRetirementListing";

export function augmentPitInInfo(
  currentItems: RankingItemProps[],
  nextItems: RankingItemProps[]
): RankingItemProps[] {
  const items = moveRetiredItemsToBottom(currentItems, nextItems);

  return items.map((item) => {
    const next = nextItems.find((n) => n.name === item.name);
    return {
      ...item,
      pitIn: next?.pitIn,
    };
  });
}

export function movePitInItemsToBottom(
  currentItems: RankingItemProps[],
  nextItems: RankingItemProps[]
): RankingItemProps[] {
  // preserve the current sort order
  const augmentedItems = augmentPitInInfo(currentItems, nextItems);

  const pitInItems = augmentedItems.filter((n) => n.pitIn);
  const nonPitInItems = augmentedItems.filter((n) => !n.pitIn);

  // move pit-in items to the bottom
  return nonPitInItems.concat(pitInItems);
}
