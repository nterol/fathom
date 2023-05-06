import { type SimulationNodeDatum } from "d3";

export type NodeDatum = SimulationNodeDatum & { id: string };
export type LinkDatum = { id: string; source: NodeDatum; target: NodeDatum };
export type Graph = {
  nodes: NodeDatum[];
  links: LinkDatum[];
};

export type Dimensions = { width: number; height: number };
