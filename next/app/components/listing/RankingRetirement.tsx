import { useState } from "react";
import { InsertItem } from "../animation/InsertItem";
import { RankingItemProps } from "../item/itemProps";
import { RankingItemNormal } from "../item/StaticItemNormal";
import { StaticItemSwitch } from "../item/StaticItemSwitch";
import { RetiredItem } from "../item/StaticItemRetired";
import { PanelHeader } from "../PanelHeader";
import styles from "./Listing.module.css";
import { RemoveRetiredItem } from "../animation/RemoveRetiredItem";
import { augmentRetirementInfo, moveRetiredItemsToBottom } from "./listing";

interface Props {
  currentItems: RankingItemProps[];
  nextItems: RankingItemProps[];
  onAnimationDone?: (items: RankingItemProps[]) => void;
}

type AnimationState = {
  name: string;
  height: number;
  doneRemove: boolean;
  doneInsert: boolean;
};

function extractRetires(items: RankingItemProps[]): AnimationState[] {
  return items
    .filter((i) => i.retired)
    .map((i) => ({
      name: i.name,
      doneRemove: false,
      doneInsert: false,
      height: 0,
    }));
}

type AnimationPhase = "remove" | "insert" | "done";

function RankingRetirementListing(props: Props) {
  const initRetires = extractRetires(props.nextItems);
  const [retires, setRetires] = useState<AnimationState[]>(initRetires);
  const [phase, setPhase] = useState<AnimationPhase>("remove");

  // Upon props change, reset the state, otherwise React states are preserved through props change.
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  const [prevCurrentItems, setCurrentItems] = useState(props.currentItems);
  const [prevdNextItems, setNextItems] = useState(props.nextItems);
  if (
    prevCurrentItems !== props.currentItems ||
    prevdNextItems !== props.nextItems
  ) {
    setCurrentItems(props.currentItems);
    setNextItems(props.nextItems);
    setRetires(initRetires);
    setPhase("remove");
  }

  //--------------------------------------------
  // Items calculation logic
  //--------------------------------------------
  const removePhaseItems = augmentRetirementInfo(
    props.currentItems,
    props.nextItems
  );
  const insertPhaseItems = moveRetiredItemsToBottom(
    props.currentItems,
    props.nextItems
  );
  const donePhaseItems = moveRetiredItemsToBottom(
    props.currentItems,
    props.nextItems
  );

  //--------------------------------------------
  // Setters and getters on the `retires` state
  //--------------------------------------------
  function setRemoveDone(name: string) {
    const index = retires.findIndex((i) => i.name === name);
    if (index === -1 || index >= retires.length) {
      const itemNames = "[" + retires.map((i) => i.name).join(", ") + "]";
      throw new Error(
        `name = ${name} not found in ${itemNames}. index = ${index} out of range`
      );
    }

    // set insert status as `done`
    const updated = [...retires];
    updated[index].doneRemove = true;
    setRetires(updated);

    // if everything is done
    const doneItems = updated.filter((i) => i.doneRemove);
    if (doneItems.length === retires.length) {
      setPhase("insert");
    }
  }

  function setInsertDone(name: string) {
    const index = retires.findIndex((i) => i.name === name);
    if (index === -1 || index >= retires.length) {
      const itemNames = "[" + retires.map((i) => i.name).join(", ") + "]";
      throw new Error(
        `name = ${name} not found in ${itemNames}. index = ${index} out of range`
      );
    }

    // set insert status as `done`
    const updated = [...retires];
    updated[index].doneInsert = true;
    setRetires(updated);

    // if everything is done
    const doneItems = updated.filter((i) => i.doneInsert);
    if (doneItems.length === retires.length) {
      setPhase("done");

      if (props.onAnimationDone) {
        props.onAnimationDone(donePhaseItems);
      }
    }
  }

  function setItemHeight(name: string, height: number) {
    const index = retires.findIndex((i) => i.name === name);
    if (index === -1 || index >= retires.length) {
      const itemNames = "[" + retires.map((i) => i.name).join(", ") + "]";
      throw new Error(
        `name = ${name} not found in ${itemNames}. index = ${index} out of range`
      );
    }

    const updated = [...retires];
    updated[index].height = height;
    setRetires(updated);
  }

  function getItemHeight(name: string) {
    const item = retires.find((i) => i.name === name);
    if (!item) {
      const itemNames = "[" + retires.map((i) => i.name).join(", ") + "]";
      throw new Error(`name = ${name} not found in ${itemNames}`);
    }

    return item.height;
  }

  //--------------------------------------------
  // Switched rendering
  //--------------------------------------------
  switch (phase) {
    case "remove":
      return (
        <div className={styles.rankingList}>
          {removePhaseItems.map((x) =>
            x.retired ? (
              <RemoveRetiredItem
                key={x.name}
                onHeightCalculated={(height) => setItemHeight(x.name, height)}
                onAnimationDone={() => setRemoveDone(x.name)}
              >
                <RankingItemNormal {...x} />
              </RemoveRetiredItem>
            ) : (
              <StaticItemSwitch key={x.name} {...x} />
            )
          )}
        </div>
      );
    case "insert": {
      return (
        <div className={styles.rankingList}>
          {insertPhaseItems.map((x) =>
            x.retired ? (
              <InsertItem
                key={x.name}
                height={getItemHeight(x.name)}
                onAnimationDone={() => {
                  setInsertDone(x.name);
                }}
              >
                <RetiredItem key={x.name} {...x} />
              </InsertItem>
            ) : (
              <StaticItemSwitch key={x.name} {...x} />
            )
          )}
        </div>
      );
    }
    case "done": {
      return (
        <div className={styles.rankingList}>
          {donePhaseItems.map((x) => (
            <StaticItemSwitch key={x.name} {...x} />
          ))}
        </div>
      );
    }
    default:
      const _exhaustiveCheck: never = phase;
      return _exhaustiveCheck;
  }
}

export function RankingRetirement(props: Props) {
  return (
    <div className={styles.component}>
      <PanelHeader />
      <RankingRetirementListing {...props} />
    </div>
  );
}
