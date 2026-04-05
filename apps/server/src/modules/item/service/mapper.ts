// import type { RichItem, RichRelation } from "@workspace/contracts/item";
// import type { Media } from "@/modules/media/schema";
// import type { ItemEntity, RelationEntity } from "../schema";

// type RawItem = ItemEntity & {
//   media: Media[];
//   outgoing: (RelationEntity & {
//     toItem: ItemEntity & {
//       media: Media[];
//     };
//   })[];
// };

// export function mapItemToRichItem(item: RawItem): RichItem {
//   const richRelations = item.outgoing.map(mapOutgoing);

//   return {
//     ...mapItem(item),
//     relation: richRelations,
//   };
// }

// function mapItem(item: ItemEntity & { media: Media[] }): Omit<RichItem, "relation"> {
//   return {
//     ...item,
//     // media: item.media.map(mapMedia),
//     media: [],
//     collectionId: undefined,
//     tags: [],
//     note: item.note ?? undefined,
//     rate: item.rate ?? undefined,
//     caption: item.caption ?? undefined,
//     deletedAt: item.deletedAt ?? undefined,
//     createdAt: item.createdAt,
//     favorite: item.favorite ?? undefined,
//     metadata: item.metadata ?? undefined,
//     updatedAt: item.updatedAt,
//     externalId: item.externalId,
//     kind: item.kind,
//     platform: item.platform,
//     url: item.url,
//   };
// }

// function mapOutgoing(relation: RawItem["outgoing"][number]): RichRelation {
//   const item = mapItem(relation.toItem);

//   return {
//     item,
//     createdAt: relation.createdAt || new Date(),
//     fromItemId: relation.fromItemId,
//     toItemId: relation.toItemId,
//     relationType: relation.relationType,
//     x: relation.x,
//     y: relation.y,
//   };
// }
