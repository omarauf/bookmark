import { useQuery } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import { orpc } from "@/integrations/orpc";
import { FolderCard } from "../components/folder-card";
import { EmptyFolder } from "../components/folder-empty";
import { LinkCard } from "../components/link-card";
import { LinkContextMenu } from "../components/link-context-menu";
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
    return <EmptyFolder />;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-3">
        {folders.map((folder) => (
          <LinkContextMenu
            key={folder.path}
            item={{ type: "folder", name: folder.name, path: folder.path }}
          >
            <FolderCard name={folder.name} path={folder.path} />
          </LinkContextMenu>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {links.map((link) => (
          <LinkContextMenu key={link.id} item={{ type: "link", link }}>
            <LinkCard link={link} />
          </LinkContextMenu>
        ))}
      </div>
    </div>
  );
}
