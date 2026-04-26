import { useQuery } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { useAppForm } from "@/components/form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { orpc } from "@/integrations/orpc";
import { useFetchPreviews } from "../hooks/use-link-mutations";

const HEADER_OPTIONS = [
  { value: "User-Agent", label: "User-Agent" },
  { value: "Authorization", label: "Authorization" },
  { value: "Cookie", label: "Cookie" },
  { value: "Accept-Language", label: "Accept-Language" },
  { value: "Accept", label: "Accept" },
  { value: "Referer", label: "Referer" },
  { value: "Origin", label: "Origin" },
  { value: "X-Forwarded-For", label: "X-Forwarded-For" },
];

type HeaderPair = {
  key: string;
  value: string;
};

export function FetchPreviewsDialog() {
  const [open, setOpen] = useState(false);
  const [headerPairs, setHeaderPairs] = useState<HeaderPair[]>([]);

  const domainQuery = useQuery(orpc.link.domains.queryOptions());

  const { mutateAsync } = useFetchPreviews();

  const form = useAppForm({
    defaultValues: {
      batchSize: 50,
      headers: {} as Record<string, string> | undefined,
      domain: undefined as string | undefined,
      overwrite: false,
    },
    onSubmit: async ({ value }) => {
      const headers: Record<string, string> = {};
      for (const pair of headerPairs) {
        if (pair.key && pair.value) {
          headers[pair.key] = pair.value;
        }
      }

      await mutateAsync({
        batchSize: value.batchSize,
        headers: Object.keys(headers).length > 0 ? headers : undefined,
        domain: value.domain,
        overwrite: value.overwrite,
      });
    },
  });

  const addHeader = () => {
    setHeaderPairs((prev) => [...prev, { key: "", value: "" }]);
  };

  const removeHeader = (index: number) => {
    setHeaderPairs((prev) => prev.filter((_, i) => i !== index));
  };

  const updateHeaderKey = (index: number, key: string) => {
    setHeaderPairs((prev) => prev.map((pair, i) => (i === index ? { ...pair, key } : pair)));
  };

  const updateHeaderValue = (index: number, val: string) => {
    setHeaderPairs((prev) => prev.map((pair, i) => (i === index ? { ...pair, value: val } : pair)));
  };

  const onOpenHandler = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      form.reset();
      setHeaderPairs([]);
    }
  };

  const onSubmitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    form.handleSubmit();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenHandler}>
      <DialogTrigger asChild>
        <Button variant="outline">Fetch Previews</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Fetch Link Previews</DialogTitle>
          <DialogDescription>
            Fetch preview data for links that don&apos;t have one yet. Optionally add custom
            headers.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmitHandler} className="space-y-4">
          <form.AppField name="batchSize">
            {(field) => <field.Number label="Batch Size" min={1} max={500} className="w-full" />}
          </form.AppField>

          <form.AppField name="domain">
            {(field) => (
              <field.Select
                label="Domain"
                className="w-full"
                placeholder="All domains"
                position="popper"
                options={domainQuery.data
                  ?.sort((a, b) => a.domain.localeCompare(b.domain))
                  .map((d) => ({ value: d.domain, label: d.domain }))}
              />
            )}
          </form.AppField>

          <form.AppField name="overwrite">
            {(field) => (
              <div className="flex items-center space-x-2">
                <field.Switch label="Overwrite existing previews" />
              </div>
            )}
          </form.AppField>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm">Custom Headers</span>
              <Button type="button" variant="ghost" size="sm" onClick={addHeader}>
                <Plus className="mr-1 h-4 w-4" />
                Add Header
              </Button>
            </div>

            {headerPairs.length === 0 && (
              <p className="text-muted-foreground text-xs">No custom headers added.</p>
            )}

            <div className="space-y-2">
              {headerPairs.map((pair, index) => (
                <div key={pair.key} className="flex items-center gap-2">
                  <Select value={pair.key} onValueChange={(val) => updateHeaderKey(index, val)}>
                    <SelectTrigger className="w-40 shrink-0">
                      <SelectValue placeholder="Header" />
                    </SelectTrigger>
                    <SelectContent>
                      {HEADER_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Value"
                    value={pair.value}
                    onChange={(e) => updateHeaderValue(index, e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="shrink-0"
                    onClick={() => removeHeader(index)}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <form.AppForm>
              <form.SubmitButton>Fetch Previews</form.SubmitButton>
            </form.AppForm>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
