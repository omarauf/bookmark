// import type { RichItemRelation } from "@workspace/contracts/item";
// import type { Media } from "@workspace/contracts/media";
// import { and, eq, exists, getTableColumns, ilike, sql } from "drizzle-orm";
// import { alias } from "drizzle-orm/pg-core";
// import { db } from "@/core/db";
// import { media } from "@/modules/media/schema";
// import { itemRelations, items } from "../schema";

// export async function findByName(creatorName: string) {
//   const related_item = alias(items, "related_item");

//   const item = await db
//     .select({
//       ...getTableColumns(items),
//       media: sql<Media[]>`
//         (
//           SELECT COALESCE(json_agg(${media}), '[]'::json)
//           FROM ${media}
//           WHERE ${media.itemId} = ${items.id}
//         )`,
//       outgoing: sql<RichItemRelation[]>`
//         (
//           SELECT COALESCE(
//               jsonb_agg(
//                   to_jsonb(${itemRelations}) ||
//                   jsonb_build_object(
//                       'toItem', to_jsonb(ri) || jsonb_build_object(
//                           'media', COALESCE(
//                               (SELECT jsonb_agg(to_jsonb(m)) FROM ${media} m WHERE m.reference_id = ri.id),
//                               '[]'::jsonb
//                           )
//                       )
//                   )
//               ),
//               '[]'::jsonb
//           )
//           FROM ${itemRelations}
//           JOIN ${items} ri ON ri.id = ${itemRelations.toItemId}
//           LEFT JOIN ${media} m ON m.reference_id = ri.id
//           WHERE ${itemRelations.fromItemId} = ${items.id}
//         )`,
//     })
//     .from(items)
//     .leftJoin(itemRelations, eq(itemRelations.fromItemId, items.id))
//     .where(
//       and(
//         eq(items.kind, "post"),
//         exists(
//           db
//             .select()
//             .from(itemRelations)
//             .leftJoin(related_item, eq(related_item.id, itemRelations.toItemId))
//             .where(
//               and(
//                 eq(itemRelations.fromItemId, items.id),
//                 ilike(sql`(${related_item.metadata}->>'name')`, `%${creatorName}%`),
//               ),
//             ),
//         ),
//       ),
//     );

//   // .where(eq(items.id, id))

//   //   if (!item) return null;

//   return item;
// }

// export async function getItem(id: string) {
//   const [item] = await db
//     .select({
//       ...getTableColumns(items),
//       media: sql<Media[]>`
//         (
//           SELECT COALESCE(json_agg(${media}), '[]'::json)
//           FROM ${media}
//           WHERE ${media.itemId} = ${id}
//         )`,
//       outgoing: sql<RichItemRelation[]>`
//         (
//           SELECT COALESCE(
//               jsonb_agg(
//                   to_jsonb(${itemRelations}) ||
//                   jsonb_build_object(
//                       'toItem', to_jsonb(ri) || jsonb_build_object(
//                           'media', COALESCE(
//                               (SELECT jsonb_agg(to_jsonb(m)) FROM ${media} m WHERE m.reference_id = ri.id),
//                               '[]'::jsonb
//                           )
//                       )
//                   )
//               ),
//               '[]'::jsonb
//           )
//           FROM ${itemRelations}
//           JOIN ${items} ri ON ri.id = ${itemRelations.toItemId}
//           LEFT JOIN ${media} m ON m.reference_id = ri.id
//           WHERE ${itemRelations.fromItemId} = ${id}
//         )`,
//     })
//     .from(items)
//     .leftJoin(itemRelations, eq(itemRelations.fromItemId, items.id))
//     .where(eq(items.id, id))
//     .limit(1);

//   if (!item) return null;

//   return item;
// }

// // export async function listItems() {
// //   const item = await db
// //     .select({
// //       ...getTableColumns(items),
// //       media: sql<Media[]>`
// //       (
// //         SELECT COALESCE(json_agg(${media}), '[]'::json)
// //         FROM ${media}
// //         WHERE ${media.referenceId} = items.id
// //       )`,
// //       //   relations: sql`
// //       //   (
// //       //     SELECT COALESCE(json_agg(${itemRelations}), '[]'::json)
// //       //     FROM ${itemRelations}
// //       //     WHERE ${itemRelations.fromItemId} = items.id
// //       //   )`,
// //       //   relations: sql`
// //       //   (
// //       //     SELECT json_agg(
// //       //         json_build_object(
// //       //             'relation', row_to_json(r),
// //       //             'item', row_to_json(ri)
// //       //         )
// //       //     )
// //       //     FROM ${itemRelations} r
// //       //     JOIN ${items} ri ON ri.id = r.to_item_id
// //       //     WHERE r.from_item_id = items.id
// //       //   )`,
// //       relations: sql<RichItemRelation[]>`
// //       (
// //         SELECT COALESCE(
// //             jsonb_agg(
// //                 to_jsonb(${itemRelations}) ||
// //                 jsonb_build_object(
// //                     'item', to_jsonb(ri) || jsonb_build_object(
// //                         'media', COALESCE(
// //                             (SELECT jsonb_agg(to_jsonb(m)) FROM ${media} m WHERE m.reference_id = ri.id),
// //                             '[]'::jsonb
// //                         )
// //                     )
// //                 )
// //             ),
// //             '[]'::jsonb
// //         )
// //         FROM ${itemRelations}
// //         JOIN ${items} ri ON ri.id = ${itemRelations.toItemId}
// //         LEFT JOIN ${media} m ON m.reference_id = ri.id
// //         WHERE ${itemRelations.fromItemId} = items.id
// //       )`,
// //     })
// //     .from(items)
// //     .limit(10);

// //   return item;
// // }
