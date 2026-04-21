import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import { Archive, File, FileText, ImageIcon, Trash2, Upload, X } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { orpc } from "@/integrations/orpc";
import { fSize } from "@/utils/format-number";

type Props = {
  onClose: () => void;
};

interface SelectedFile {
  id: string;
  file: File;
  previewUrl: string | null;
}

function FileTypeIcon({ file }: { file: File }) {
  const extension = file.name.split(".").pop()?.toLowerCase();
  const className = "h-8 w-8";
  switch (extension) {
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
    case "webp":
      return <ImageIcon className={`${className} text-green-500`} />;
    case "pdf":
    case "doc":
    case "docx":
    case "txt":
      return <FileText className={`${className} text-red-500`} />;
    case "zip":
    case "rar":
    case "7z":
      return <Archive className={`${className} text-orange-500`} />;
    default:
      return <File className={`${className} text-gray-500`} />;
  }
}

export function UploadDialog({ onClose }: Props) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const dropZoneId = useId();

  const folderId = useSearch({
    from: "/_authenticated/file-manager/",
    select: (s) => s.folderId,
  });

  const uploadMutation = useMutation(orpc.file.upload.mutationOptions());

  const createSelectedFile = useCallback((file: File): SelectedFile => {
    const isImage = file.type.startsWith("image/");
    return {
      id: crypto.randomUUID(),
      file,
      previewUrl: isImage ? URL.createObjectURL(file) : null,
    };
  }, []);

  const addFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const newFiles = Array.from(files).map(createSelectedFile);
      setSelectedFiles((prev) => {
        const map = new Map(prev.map((f) => [f.file.name, f]));
        for (const f of newFiles) {
          const existing = map.get(f.file.name);
          if (existing?.previewUrl) {
            URL.revokeObjectURL(existing.previewUrl);
          }
          map.set(f.file.name, f);
        }
        return Array.from(map.values());
      });
    },
    [createSelectedFile],
  );

  const removeFile = useCallback((id: string) => {
    setSelectedFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file?.previewUrl) URL.revokeObjectURL(file.previewUrl);

      return prev.filter((f) => f.id !== id);
    });
  }, []);

  const clearAllFiles = useCallback(() => {
    setSelectedFiles((prev) => {
      for (const f of prev) {
        if (f.previewUrl) URL.revokeObjectURL(f.previewUrl);
      }
      return [];
    });
  }, []);

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setIsUploading(true);
    try {
      await uploadMutation.mutateAsync({
        files: selectedFiles.map((s) => s.file),
        folderId,
      });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: orpc.browse.list.key() }),
        queryClient.invalidateQueries({ queryKey: orpc.folder.tree.key() }),
      ]);
      toast.success(`${selectedFiles.length} file(s) uploaded successfully`);
      clearAllFiles();
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to upload files");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    addFiles(e.target.files);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  };

  // Clean up remaining object URLs on unmount
  const selectedFilesRef = useRef(selectedFiles);
  selectedFilesRef.current = selectedFiles;

  useEffect(() => {
    return () => {
      for (const f of selectedFilesRef.current) {
        if (f.previewUrl) {
          URL.revokeObjectURL(f.previewUrl);
        }
      }
    };
  }, []);

  return (
    <DialogContent className="sm:max-w-xl">
      <DialogHeader>
        <DialogTitle>Upload Files</DialogTitle>
        <DialogDescription>
          Drag and drop files here, or click to browse. You can review and remove files before
          uploading.
        </DialogDescription>
      </DialogHeader>

      <div
        aria-hidden="true"
        className={`mt-2 rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
          isDragging ? "border-primary bg-primary/10" : "border-muted-foreground/25"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
            <Upload className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <p>
              <span className="font-medium">Drop files here</span> or click to browse
            </p>
            <p className="text-muted-foreground text-xs">You can select multiple files</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="mt-2"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
          >
            Select Files
          </Button>
        </div>
        <input
          ref={fileInputRef}
          id={dropZoneId}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileInputChange}
        />
      </div>

      {selectedFiles.length > 0 && (
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="font-medium text-sm">
              {selectedFiles.length} file
              {selectedFiles.length !== 1 ? "s" : ""} selected
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-destructive hover:text-destructive"
              onClick={clearAllFiles}
              disabled={isUploading}
            >
              <Trash2 className="mr-1 h-3.5 w-3.5" />
              Remove all
            </Button>
          </div>
          <ScrollArea className="h-50 rounded-md border pr-3">
            <div className="space-y-1 p-2">
              {selectedFiles.map((selected) => (
                <div
                  key={selected.id}
                  className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-muted/50"
                >
                  {selected.previewUrl ? (
                    <img
                      src={selected.previewUrl}
                      alt={selected.file.name}
                      className="h-10 w-10 rounded-md object-cover"
                    />
                  ) : (
                    <FileTypeIcon file={selected.file} />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-sm">{selected.file.name}</p>
                    <p className="text-muted-foreground text-xs">{fSize(selected.file.size)}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={() => removeFile(selected.id)}
                    disabled={isUploading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      <DialogFooter className="mt-4">
        <DialogClose asChild>
          <Button type="button" variant="outline" disabled={isUploading}>
            Cancel
          </Button>
        </DialogClose>
        <Button onClick={handleUpload} disabled={selectedFiles.length === 0 || isUploading}>
          {isUploading
            ? "Uploading..."
            : `Upload${selectedFiles.length > 0 ? ` (${selectedFiles.length})` : ""}`}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
