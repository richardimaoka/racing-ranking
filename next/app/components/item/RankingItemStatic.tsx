import { PitInItem } from "./PitInItem";
import { RankingItemProps } from "./RankingItem";
import { RankingItemNormal } from "./RankingItemNormal";
import { RetiredItem } from "./RetiredItem";

type Props = RankingItemProps;

export function RankingItemStatic(props: Props): JSX.Element {
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
