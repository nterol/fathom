import { useEffect, type RefObject } from "react";
import { type LinkDatum, type NodeDatum } from "./types";
import { type BaseType, select } from "d3";

type NodeProps = {
  nodeRef?: RefObject<SVGGElement>;
  node: NodeDatum;
};

function useD3BridgeData<T extends BaseType, U>(
  ref: RefObject<T> | undefined,
  datum: U
) {
  useEffect(() => {
    if (!ref?.current) return;
    select<T, U>(ref.current).datum(datum);
  }, [datum, ref]);
}

export function Node({ nodeRef, node }: NodeProps) {
  useD3BridgeData<SVGGElement, NodeDatum>(nodeRef, node);

  const { id, x, y } = node;

  return (
    <g
      ref={nodeRef}
      className="node"
      transform={`translate(${Math.abs(x ?? 0)}, ${y ?? 0})`}
      strokeOpacity={1}
      strokeWidth={1.5}
    >
      <circle r="10" fill="white" stroke="#fed7d7"></circle>
      <text fill="black">{id}</text>
    </g>
  );
}

type EdgeProps = {
  linkRef?: RefObject<SVGLineElement>;
  edge: LinkDatum;
};

export function Edge({ linkRef, edge }: EdgeProps) {
  useD3BridgeData<SVGLineElement, LinkDatum>(linkRef, edge);

  const { source, target }: { source: NodeDatum; target: NodeDatum } = edge;
  return (
    <line
      ref={linkRef}
      fill="black"
      stroke="black"
      strokeWidth="6"
      x1={source?.x ?? 0}
      x2={target.x ?? 0}
      y1={source?.y ?? 0}
      y2={target?.y ?? 0}
      // strokeDasharray="4"
      // strokeLinecap="round"
      className="link"
    />
  );
}
