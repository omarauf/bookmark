import { useQuery } from "@tanstack/react-query";
import { resolveLtreeLabel, slugify } from "@workspace/core/slugify";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { orpc } from "@/integrations/orpc";

type Props = {
  parentId: string | null;
  slug: string;
  label: string;
};

export function CollectionPreview({ parentId, slug, label }: Props) {
  const { data } = useQuery(
    orpc.collection.get.queryOptions({ input: { id: parentId || "" }, enabled: !!parentId }),
  );

  const selectedParent = data;

  const generatedSlug = useMemo(() => {
    const base = slug.trim().length > 0 ? slug : label;
    return slugify(base, { lower: true });
  }, [slug, label]);

  const generatedPath = useMemo(() => {
    if (!generatedSlug) return "";
    const pathLabel = resolveLtreeLabel(generatedSlug);
    return selectedParent ? `${selectedParent.path}.${pathLabel}` : pathLabel;
  }, [generatedSlug, selectedParent]);

  const generatedLevel = useMemo(() => {
    return selectedParent ? selectedParent.level + 1 : 1;
  }, [selectedParent]);

  return (
    <div className="space-y-3 rounded-lg border border-border bg-muted/30 px-4 py-3">
      <div className="font-medium text-foreground text-sm">Preview</div>
      <div className="grid grid-cols-3">
        <div className="space-y-1">
          <p className="text-muted-foreground text-xs">Generated Slug</p>
          <Badge variant="outline" className="w-fit font-mono">
            {generatedSlug || <span className="text-muted">—</span>}
          </Badge>
        </div>
        <div className="space-y-1">
          <p className="text-muted-foreground text-xs">Generated Path</p>
          <Badge
            variant="secondary"
            className="max-w-full overflow-hidden text-ellipsis font-mono text-xs"
          >
            {generatedPath || <span className="text-muted">—</span>}
          </Badge>
        </div>
        <div className="space-y-1">
          <p className="text-muted-foreground text-xs">Level</p>
          <Badge className="w-fit">{generatedLevel}</Badge>
        </div>
      </div>
    </div>
  );
}
