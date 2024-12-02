// import { useEffect, useRef, useState } from "react";

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
  fastest?: string;
}

export type RankingItemProps = Props;
