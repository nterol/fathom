import { createRef, useMemo, useRef, useEffect } from "react";
import { select, type Simulation } from "d3";

import { Edge, Node } from "./graph-elements";
import { initSimulation, updateGraph } from "./utils";
import { type NodeDatum, type Graph } from "./types";
import { api } from "@/utils/api";

const graph: Graph = {
  // TODO: use d3.map to iterate over object instead of string
  //   links: [
  //     { id: "A->B", source: { id: "A" }, target: { id: "B" } },
  //     { id: "A->C", source: { id: "A" }, target: { id: "C" } },
  //   ],
  links: [
    { id: "A->B", source: "A", target: "B" },
    { id: "A->C", source: "A", target: "C" },
  ],
  nodes: [{ id: "A" }, { id: "B" }, { id: "C" }],
};

export function MiniGraphView({
  currentNoteID,
}: {
  currentNoteID: string;
}): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const simulation = useRef<Simulation<NodeDatum, undefined> | null>(null);

  const ctx = api.useContext();

  const data = ctx.notes.get.byID.getData({ id: currentNoteID });

  console.log({ fromGraph: data });

  const { nodes, links } = graph;

  const nodeRefs = useMemo(
    () => Array.from({ length: nodes.length }, () => createRef<SVGGElement>()),
    [nodes.length]
  );

  const linkRefs = useMemo(
    () =>
      Array.from({ length: nodes.length }, () => createRef<SVGLineElement>()),
    [nodes.length]
  );

  useEffect(() => {
    if (!containerRef.current) return;
    const { width, height } = containerRef.current.getBoundingClientRect();
    const dimensions = { width: width - 10, height: height - 10 };
    simulation.current = initSimulation(graph, dimensions);

    const graphContainer = select(containerRef.current);

    simulation.current.on("tick", () => {
      graphContainer.call(updateGraph(dimensions));
      //   nodes[0].x = dimensions.width / 2;
      //   nodes[0].y = dimensions.height / 2;
    });
  }, [links, nodes]);

  return (
    <div
      ref={containerRef}
      className="aspect-video w-full rounded-lg bg-red-200"
    >
      <svg className="h-full w-full" preserveAspectRatio="xMidYMid meet">
        {links.map((link, i) => (
          <Edge key={link.id} linkRef={linkRefs[i]} edge={link} />
        ))}
        {nodes.map((node, i) => (
          <Node key={node.id} nodeRef={nodeRefs[i]} node={node} />
        ))}
      </svg>
    </div>
  );
}
