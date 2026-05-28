import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { type Platform, PlatformValues } from "@workspace/contracts/platform";
import { parseIngestFilename } from "@workspace/core/ingest";
import { AlertCircle, Check, FileJson, Upload } from "lucide-react";
import type React from "react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { DatePicker } from "@/components/inputs/date-picker";
import { XSelect } from "@/components/inputs/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { orpc } from "@/integrations/orpc";
import { fSize } from "@/utils/format-number";

export function UploadButton() {
  const [open, setOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [jsonData, setJsonData] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [type, setType] = useState<Platform>();
  const [scrapedAt, setScrapedAt] = useState<Date | undefined>(new Date());
  const queryClient = useQueryClient();

  const uploadMutation = useMutation(
    orpc.ingest.create.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: orpc.ingest.list.key() });
        if (data?.jobId) {
          toast.success(
            <div className="flex flex-col gap-1">
              <span>Upload queued for processing.</span>
              <Link to="/jobs" className="text-primary text-xs underline">
                View job {data.jobId.slice(0, 8)}…
              </Link>
            </div>,
          );
        } else {
          toast.success("Ingest updated.");
        }
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const reset = () => {
    setIsDragging(false);
    setFile(null);
    setJsonData(null);
    setError(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const validateAndProcessFile = (selectedFile: File) => {
    setError(null);

    // Check if file is JSON
    if (selectedFile.type !== "application/json" && !selectedFile.name.endsWith(".json")) {
      setError("Please select a valid JSON file");
      setFile(null);
      return;
    }

    const filename = selectedFile.name.split(".").slice(0, -1).join(".");
    const { scrapedAt, platform } = parseIngestFilename(filename);

    if (scrapedAt === undefined || platform === undefined) {
      setError("Invalid filename format. Expected format: {platform}_YYYY-MM-DD_HH-MM-SS.json");
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setScrapedAt(scrapedAt);
    setType(platform);

    // Read file content
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        setJsonData(json);
      } catch (_) {
        setError("Invalid JSON format");
        setFile(null);
      }
    };
    reader.readAsText(selectedFile);
  };

  const handleIngest = async () => {
    if (file === null) {
      toast.error("No file selected");
      return;
    }

    if (type === undefined) {
      toast.error("Please select an ingest type");
      return;
    }

    if (scrapedAt === undefined) {
      toast.error("Please select a date");
      return;
    }

    try {
      const result = uploadMutation.mutateAsync({ file });

      toast.promise(result, {
        loading: "Uploading...",
        success: "File uploaded and queued for processing.",
        error: "Error uploading file",
      });

      result.then(() => {
        queryClient.invalidateQueries({ queryKey: ["ingests"] });
      });

      setOpen(false);
      setTimeout(() => {
        setFile(null);
        setJsonData(null);
      }, 300);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        reset();
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <FileJson className="mr-2 h-4 w-4" />
          Upload JSON
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ingest JSON File</DialogTitle>
          <DialogDescription>
            Upload a JSON file by dropping it here or selecting it from your device.
          </DialogDescription>
        </DialogHeader>

        <div
          aria-hidden="true"
          className={`mt-4 rounded-lg border-2 border-dashed p-6 text-center ${
            isDragging
              ? "border-primary bg-primary/10"
              : file
                ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                : "border-muted-foreground/25"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {file ? (
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="font-medium">{file.name}</p>
                <p className="text-muted-foreground text-sm">{fSize(file.size / 1024)}</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                <Upload className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex flex-col items-center gap-1">
                <p>
                  <span className="font-medium">Drop your JSON file here</span> or click to browse
                </p>
                <p className="text-muted-foreground text-xs">Only .json files are supported</p>
              </div>
              <Button variant="ghost" size="sm" className="mt-2" onClick={triggerFileInput}>
                Select File
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                className="hidden"
                onChange={handleFileInputChange}
              />
            </div>
          )}
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {jsonData !== null && (
          <div className="mt-2">
            <p className="font-medium text-sm">
              {Array.isArray(jsonData) && jsonData.length > 0
                ? `The JSON contains ${jsonData.length} pages.`
                : "The JSON does not contain any pages."}
            </p>
          </div>
        )}

        <XSelect
          placeholder="Ingest Type"
          value={type}
          onChange={setType}
          options={PlatformValues.map((p) => p)}
          className="w-full"
        />

        <DatePicker label="To" date={scrapedAt} setDate={setScrapedAt} className="w-full" />

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleIngest} disabled={!file || !jsonData}>
            Ingest
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
