import {
  forceSimulation,
  forceLink,
  forceCenter,
  forceCollide,
  forceManyBody,
  type SimulationLinkDatum,
  type Selection,
  type BaseType,
} from "d3";
import {
  type LinkDatum,
  type Dimensions,
  type Graph,
  type NodeDatum,
} from "./types";

export function initSimulation(
  g: Graph,
  dimensions: { width: number; height: number }
) {
  const { nodes, links } = g;

  const { width, height } = dimensions;
  return forceSimulation<NodeDatum>(nodes)
    .force("charge", forceManyBody())
    .force(
      "link",
      forceLink<NodeDatum, SimulationLinkDatum<NodeDatum>>(links).id((d) => {
        console.log({ d });
        return d.id;
      })
    )
    .force(
      "center",
      forceCenter()
        .x(width / 2)
        .y(height / 2)
    );
  // s
}

export function updateNode(
  dimension: Dimensions
): (s: Selection<SVGGElement, NodeDatum, BaseType, undefined>) => void {
  return (s) => {
    s.attr("transform", ({ x = 0, y = 0 }) => {
      if (x > dimension.width) x = dimension.width - 1;
      if (y > dimension.height) y = dimension.height - 1;
      return `translate(${Math.abs(x)},${Math.abs(y)})`;
    });
  };
}

export function updateLink(
  allLinks: Selection<SVGLineElement, LinkDatum, BaseType, unknown>
) {
  allLinks
    .attr("x1", (d) => d.source.x ?? 0)
    .attr("y1", (d) => d.source.y ?? 0)
    .attr("x2", (d) => d.target.x ?? 0)
    .attr("y2", (d) => d.target.y ?? 0);
}

export function updateGraph(
  dimensions: Dimensions
): (s: Selection<HTMLDivElement, unknown, null, undefined>) => void {
  return (selection: Selection<HTMLDivElement, unknown, null, undefined>) => {
    selection
      .selectAll<SVGGElement, NodeDatum>(".node")
      .call(updateNode(dimensions));
    selection.selectAll<SVGLineElement, LinkDatum>(".link").call(updateLink);
  };
}
