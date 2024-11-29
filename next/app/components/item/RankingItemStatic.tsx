import { PitInItem } from "./PitInItem";
import { RankingItemNormal } from "./RankingItemNormal";
import { RetiredItem } from "./RetiredItem";

interface Props {
  team: string;
  teamIconPath: string;
  ranking: number;
  name: string;
  interval?: number;
  next?: {
    ranking: number;
    interval?: number;
    animationEnd?: boolean;
    onTransitionEnd?: () => void;
  };
  retired?: boolean;
  pitIn?: boolean;
}

export type RankingStaticProps = Props;

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
        team={""}
        teamIconPath={""}
        ranking={0}
        name={""}
        interval={0}
      />
    );
  }
}
