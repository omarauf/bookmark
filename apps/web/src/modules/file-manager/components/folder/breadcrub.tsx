import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { XBreadcrumb } from "@/components/breadcrumb";
import { orpc } from "@/integrations/orpc";

export function FolderBreadcrumb() {
  const folderId = useSearch({ from: "/_authenticated/file-manager/", select: (s) => s.folderId });

  const query = useQuery(
    orpc.folder.breadcrumb.queryOptions({
      input: { folderId: folderId || "" },
      enabled: !!folderId,
    }),
  );

  const breadcrumbs = [...(query.data || [])];

  const navigate = useNavigate();
  const onClickHandler = (value: string) => {
    const result = value === "" ? undefined : value;
    navigate({ to: ".", search: (s) => ({ ...s, folderId: result }) });
  };

  return (
    <XBreadcrumb
      className="border-border border-b p-3"
      breadcrumbs={breadcrumbs}
      onClick={onClickHandler}
    />
  );
}
