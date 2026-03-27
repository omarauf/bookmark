// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";

// type Props = {
//   userTags: Posts;
// };

// export function RenderUserTags({ userTags }: Props) {
//   if (userTags.length === 0) return null;

//   return (
//     <div>
//       <h3 className="mb-2 font-medium text-sm">Tagged Users</h3>
//       <div className="flex flex-wrap gap-2">
//         {userTags.map((tag, index) => (
//           <Badge key={index} variant="secondary" className="flex items-center gap-1">
//             <Avatar className="h-4 w-4">
//               <AvatarImage
//                 src={tag.user.profilePicture || "/placeholder.svg"}
//                 alt={tag.user.username}
//               />
//               <AvatarFallback>{tag.user.username.substring(0, 1).toUpperCase()}</AvatarFallback>
//             </Avatar>
//             {tag.user.username}
//           </Badge>
//         ))}
//       </div>
//     </div>
//   );
// }
