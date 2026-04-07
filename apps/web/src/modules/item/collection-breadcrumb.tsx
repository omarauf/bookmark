import { useNavigate, useSearch } from "@tanstack/react-router";
import { XBreadcrumb } from "@/components/breadcrumb";
import { useCollection } from "../collections/hooks/use-ad-categories";

export function CollectionBreadcrumb() {
  const defaultPath = useSearch({ strict: false, select: (s) => s.collectionPath || "" });
  const navigate = useNavigate();
  const { active, pathNode, onClickHandler } = useCollection({ defaultPath });

  const onItemClickHandler = (value: string) => {
    console.log("Breadcrumb clicked:", value);
    navigate({ to: ".", search: (s) => ({ ...s, collectionPath: value }) });
    onClickHandler(value);
  };

  return <XBreadcrumb breadcrumbs={pathNode(active)} onClick={onItemClickHandler} />;
}
