import { RankingItemProps } from "../item/RankingItem";

export function augmentRetirementInfo(
  items: RankingItemProps[],
  nextItems: RankingItemProps[]
): RankingItemProps[] {
  return items.map((current) => {
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
  // preserve the current sort order
  const augmentedItems = augmentRetirementInfo(currentItems, nextItems);

  const retiredItems = augmentedItems.filter((n) => n.retired);
  const nonRetiredItems = augmentedItems.filter((n) => !n.retired);

  // move retired items to the bottom
  return nonRetiredItems.concat(retiredItems);
}
