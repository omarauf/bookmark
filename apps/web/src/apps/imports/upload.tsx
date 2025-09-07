import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert, AlertDescription } from "@workspace/ui/components/alert";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import dayjs from "dayjs";
import { AlertCircle, Check, FileJson, Upload } from "lucide-react";
import type React from "react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { orpc } from "@/api/rpc";
import { DatePicker } from "@/components/form/date-picker";
import { XSelect } from "@/components/form/select";
import { fSize } from "@/utils/format-number";

export function UploadButton() {
  const [open, setOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [jsonData, setJsonData] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [type, setType] = useState<"instagram">();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const queryClient = useQueryClient();

  const uploadMutation = useMutation(
    orpc.imports.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: orpc.imports.list.key() });
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

    const [fileType, fileDate] = filename.split("-");

    const parsedDate = dayjs(fileDate, "YYYY.MM.DD_HH.mm.ss");

    if (!parsedDate.isValid()) {
      setError("Invalid date format in filename. Expected format: YYYY.MM.DD_HH.mm.ss");
      setFile(null);
      return;
    }

    if (fileType !== "instagram") {
      setError("Unsupported file type. Only 'instagram' files are supported.");
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setDate(parsedDate.toDate());
    setType(fileType);

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

  const handleImport = async () => {
    if (file === null) {
      toast.error("No file selected");
      return;
    }

    if (type === undefined) {
      toast.error("Please select an import type");
      return;
    }

    if (date === undefined) {
      toast.error("Please select a date");
      return;
    }

    const result = uploadMutation.mutateAsync({ file, type, date: date });

    toast.promise(result, {
      loading: "Loading...",
      success: () => "File uploaded successfully!",
      error: "Error uploading file",
    });

    result.then(() => {
      queryClient.invalidateQueries({ queryKey: ["imports"] });
    });

    setOpen(false);
    setTimeout(() => {
      setFile(null);
      setJsonData(null);
    }, 300);
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
          <DialogTitle>Import JSON File</DialogTitle>
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
          placeholder="Import Type"
          value={type}
          onChange={setType}
          options={["instagram"]}
          className="w-full"
        />

        <DatePicker label="To" date={date} setDate={setDate} className="w-full" />

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleImport} disabled={!file || !jsonData}>
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
