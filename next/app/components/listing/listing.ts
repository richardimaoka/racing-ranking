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

export function augmentShuffleInfo(
  currentItems: RankingItemProps[],
  nextItems: RankingItemProps[]
): RankingItemProps[] {
  const items = movePitInItemsToBottom(currentItems, nextItems);

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

export function skipPitInPhase(nextItems: RankingItemProps[]): boolean {
  return nextItems.findIndex((i) => i.pitIn) === -1;
}

export function fromRetirementPhase(
  currentItems: RankingItemProps[],
  nextItems: RankingItemProps[]
): RankingItemProps[] {
  const items = moveRetiredItemsToBottom(currentItems, nextItems);
  return augmentPitInInfo(items, nextItems);
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

//----------------------------------------------------
// Phase-specific init/done items
//----------------------------------------------------
export function initItemsForRetirement(
  currentItems: RankingItemProps[],
  nextItems: RankingItemProps[]
): RankingItemProps[] {
  return augmentRetirementInfo(currentItems, nextItems);
}

export function doneItemsForRetirement(
  currentItems: RankingItemProps[],
  nextItems: RankingItemProps[]
): RankingItemProps[] {
  return moveRetiredItemsToBottom(currentItems, nextItems);
}

export function initItemsForPitIn(
  currentItems: RankingItemProps[],
  nextItems: RankingItemProps[]
): RankingItemProps[] {
  const items = doneItemsForRetirement(currentItems, nextItems);
  return augmentPitInInfo(items, nextItems);
}

export function doneItemsForPitIn(
  currentItems: RankingItemProps[],
  nextItems: RankingItemProps[]
): RankingItemProps[] {
  return movePitInItemsToBottom(currentItems, nextItems);
}

// export function pitOutPhaseInitItems(
//   currentItems: RankingItemProps[],
//   nextItems: RankingItemProps[]
// ): RankingItemProps[] {
//   return
// }

// export function pitOurPhaseDoneItems(
//   currentItems: RankingItemProps[],
//   nextItems: RankingItemProps[]
// ): RankingItemProps[] {
//   return
// }

export function initItemsForShuffle(
  currentItems: RankingItemProps[],
  nextItems: RankingItemProps[]
): RankingItemProps[] {
  return doneItemsForPitIn(currentItems, nextItems);
}

export function doneItemsForShuffle(
  currentItems: RankingItemProps[],
  nextItems: RankingItemProps[]
): RankingItemProps[] {
  return moveRetiredItemsToBottom(currentItems, nextItems);
}

export function initItemsForValueChange(
  currentItems: RankingItemProps[],
  nextItems: RankingItemProps[]
): RankingItemProps[] {
  return doneItemsForShuffle(currentItems, nextItems);
}

export function doneItemsForValueChange(
  currentItems: RankingItemProps[],
  nextItems: RankingItemProps[]
): RankingItemProps[] {
  return moveRetiredItemsToBottom(currentItems, nextItems);
}
