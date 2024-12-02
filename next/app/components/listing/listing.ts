import { RankingItemProps } from "../item/RankingItem";

//----------------------------------------------------
// augment functions
//----------------------------------------------------

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

export function augmentPitInInfo(
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
  return currentItems.map((current) => {
    const next = nextItems.find((n) => n.name === current.name);
    return {
      ...current,
      next: next
        ? {
            ranking: next.ranking,
          }
        : undefined,
    };
  });
}

export function augmentFastestInfo(
  currentItems: RankingItemProps[],
  nextItems: RankingItemProps[]
): RankingItemProps[] {
  return currentItems.map((c) => {
    const next = nextItems.find((n) => n.name === c.name);
    return {
      ...c,
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
  return currentItems.map((c) => {
    const next = nextItems.find((n) => n.name === c.name);
    return {
      ...c,
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

//----------------------------------------------------
// sort functions
//----------------------------------------------------

export function movePitInItemsToBottom(
  currentItems: RankingItemProps[],
  nextItems: RankingItemProps[]
): RankingItemProps[] {
  // preserve the current sort order, and augment the info (re-doing augment is just fine)
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

// match to nextItem's sort oder, but return the current items' element
export function matchToNextItemsSortOrder(
  currentItems: RankingItemProps[],
  nextItems: RankingItemProps[]
): RankingItemProps[] {
  return nextItems.map((next) => {
    const current = currentItems.find((i) => i.name === next.name);
    return current ? current : next;
  });
}
//----------------------------------------------------
// phase-skip judgement
//----------------------------------------------------

export function skipRetirementPhase(nextItems: RankingItemProps[]): boolean {
  return nextItems.findIndex((i) => i.retired) === -1;
}

export function skipPitInPhase(nextItems: RankingItemProps[]): boolean {
  return nextItems.findIndex((i) => i.pitIn) === -1;
}

export function skipShufflePhase(
  currentItems: RankingItemProps[],
  nextItems: RankingItemProps[]
): boolean {
  for (
    let currentIndex = 0;
    currentIndex < currentItems.length;
    currentIndex++
  ) {
    const current = currentItems[currentIndex];
    const nextIndex = nextItems.findIndex((n) => n.name === current.name);

    if (currentIndex !== nextIndex) {
      console.log("skipShufflePhase return false");
      return false; // rank changed, don't skip
    }
  }

  console.log("skipShufflePhase return true");
  return true;
}

//----------------------------------------------------
// Phase-specific init/done items
//----------------------------------------------------

export function doneItemsForPitIn(
  currentItems: RankingItemProps[],
  nextItems: RankingItemProps[]
): RankingItemProps[] {
  return movePitInItemsToBottom(currentItems, nextItems);
}

export function initItemsForShuffle(
  currentItems: RankingItemProps[],
  nextItems: RankingItemProps[]
): RankingItemProps[] {
  const prevItems = doneItemsForPitIn(currentItems, nextItems);
  return augmentShuffleInfo(prevItems, nextItems);
}
