import type { CreateRelation, Relation } from "@workspace/contracts/relation";

type FromItem = {
  externalId: string;
};

type ToItem = {
  externalId: string;
  x?: number;
  y?: number;
};

export function relation(from: FromItem, to: ToItem | ToItem[], type: Relation): CreateRelation[] {
  const toArray = Array.isArray(to) ? to : [to];

  return toArray.map((toItem) => ({
    fromExternalId: from.externalId,
    toExternalId: toItem.externalId,
    relationType: type,
    x: toItem.x,
    y: toItem.y,
  }));
}
