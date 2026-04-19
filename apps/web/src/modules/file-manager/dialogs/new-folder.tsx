import { useMutation, useQueryClient } from "@tanstack/react-query";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { orpc } from "@/integrations/orpc";

type Props = {
  onClose: () => void;
  parentId?: string;
};

export function NewFolderDialog({ onClose, parentId }: Props) {
  const queryClient = useQueryClient();
  const [name, setName] = useState("New Folder");

  const createMutation = useMutation(orpc.folder.create.mutationOptions());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      await createMutation.mutateAsync({ name: name.trim(), parentId });
      queryClient.invalidateQueries({ queryKey: orpc.browse.list.key() });
      queryClient.invalidateQueries({ queryKey: orpc.folder.tree.key() });
      onClose();
      setName("New Folder");
    } catch (error) {
      console.error("Failed to create folder:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Create New Folder</DialogTitle>
        <DialogDescription>Enter a name for the new folder</DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Folder Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter folder name..."
              autoFocus
            />
          </div>
        </div>

        <DialogFooter className="mt-6">
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={createMutation.isPending}>
              Cancel
            </Button>
          </DialogClose>

          <Button type="submit" disabled={createMutation.isPending || !name.trim()}>
            {createMutation.isPending ? "Creating..." : "Create Folder"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
