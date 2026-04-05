import type { CreateItemRelation, Relation } from "@workspace/contracts/item-relation";

type FromItem = {
  externalId: string;
};

type ToItem = {
  externalId: string;
  x?: number;
  y?: number;
};

export function itemRelation(
  from: FromItem,
  to: ToItem | ToItem[],
  type: Relation,
): CreateItemRelation[] {
  const toArray = Array.isArray(to) ? to : [to];

  return toArray.map((toItem) => ({
    fromExternalId: from.externalId,
    toExternalId: toItem.externalId,
    relationType: type,
    x: toItem.x,
    y: toItem.y,
  }));
}
