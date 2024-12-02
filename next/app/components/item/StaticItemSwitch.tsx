import { PitInItem } from "./StaticItemPitIn";
import { RankingItemProps } from "./itemProps";
import { RankingItemNormal } from "./StaticItemNormal";
import { RetiredItem } from "./StaticItemRetired";

type Props = RankingItemProps;

export function StaticItemSwitch(props: Props): JSX.Element {
  if (props.retired) {
    return (
      <RetiredItem
        team={props.team}
        teamIconPath={props.teamIconPath}
        name={props.name}
      />
    );
  } else if (props.pitIn) {
    return (
      <PitInItem
        team={props.team}
        teamIconPath={props.teamIconPath}
        name={props.name}
      />
    );
  } else {
    return (
      <RankingItemNormal
        team={props.team}
        teamIconPath={props.teamIconPath}
        ranking={props.ranking}
        name={props.name}
        interval={props.interval}
      />
    );
  }
}
