import { useQuery } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import { Globe } from "lucide-react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { orpc } from "@/integrations/orpc";
import { FolderCard } from "../components/folder-card";
import { LinkCard } from "../components/link-card";
import { LinkSkeletons } from "../components/link-skeleton";

export function Content() {
  const path = useSearch({ from: "/_authenticated/links/", select: (s) => s.path });

  const treeQuery = useQuery(orpc.link.tree.queryOptions({ input: { path } }));

  const folders = treeQuery.data?.folders ?? [];
  const links = treeQuery.data?.links ?? [];

  if (treeQuery.isLoading) {
    return <LinkSkeletons />;
  }

  if (folders.length === 0 && links.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Globe />
          </EmptyMedia>
          <EmptyTitle>No links here</EmptyTitle>
          <EmptyDescription>
            This folder is empty. Navigate to a different folder or add some bookmarks.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {folders.map((folder) => (
          <FolderCard key={folder.path} name={folder.name} path={folder.path} />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {links.map((link) => (
          <LinkCard key={link.id} link={link} />
        ))}
      </div>
    </div>
  );
}
