import { RankingItemProps } from "../item/RankingItem";

function augmentPitInInfo(
  items: RankingItemProps[],
  nextItems: RankingItemProps[]
): RankingItemProps[] {
  return items.map((item) => {
    const next = nextItems.find((n) => n.name === item.name);
    return {
      ...item,
      pitIn: next?.pitIn,
    };
  });
}

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

export function fromRetirementPhase(
  currentItems: RankingItemProps[],
  nextItems: RankingItemProps[]
): RankingItemProps[] {
  const items = moveRetiredItemsToBottom(currentItems, nextItems);
  return augmentPitInInfo(items, nextItems);
}

export function movePitInItemsToBottom(
  currentItems: RankingItemProps[],
  nextItems: RankingItemProps[]
): RankingItemProps[] {
  // preserve the current sort order
  const augmentedItems = augmentPitInInfo(
    augmentRetirementInfo(currentItems, nextItems),
    nextItems
  );

  const pitInItems = augmentedItems.filter((n) => n.pitIn);
  const retiredItems = augmentedItems.filter((n) => n.retired);
  const preservedItems = augmentedItems.filter((n) => !n.pitIn && !n.retired);

  // move pit-in items to the bottom
  return preservedItems.concat(pitInItems).concat(retiredItems);
}

export function skipPitInPhase(nextItems: RankingItemProps[]): boolean {
  return nextItems.findIndex((i) => i.pitIn) === -1;
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

export function skipRetirementPhase(nextItems: RankingItemProps[]): boolean {
  return nextItems.findIndex((i) => i.retired) === -1;
}
