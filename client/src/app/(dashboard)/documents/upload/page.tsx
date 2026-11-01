"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  FileText,
  Files,
  FolderUp,
  Info,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useUploadPDFFile } from "@/hooks/use-documents";
import { MAX_FILE_SIZE_BYTES } from "@/constants/app.constants";

export default function UploadDocumentPage() {
  const { mutate, isPending } = useUploadPDFFile();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);

  function uploadFile() {
    if (selectedFile) {
      mutate(selectedFile,{
        onSuccess:(data) => {
          toast.success("Document uploaded successfully")
        },
        onError:(error) => {
          toast.error("Failed to upload document")
        }
      });
      console.log("is Success");
    }
  }

  const validatePdfFile = async (file: File): Promise<string | null> => {
    if (file === null) {
      return "Select file to upload";
    }

    if (file.size == 0) {
      return "The selected file is empty.";
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return "File size must not exceed 20 MB.";
    }

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      return "Only PDF Files are supported";
    }

    if (file.type !== "application/pdf") {
      return "The selected file does not appear to be a valid PDF.";
    }

    const header = await file.slice(0, 5).arrayBuffer();
    const signature = new TextDecoder().decode(header);

    if (signature !== "%PDF-") {
      return "The selected file does not appear to be a valid PDF.";
    }

    return null;
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.currentTarget?.files?.[0];

    if (!file) {
      toast.error("No file selected");
      return;
    }

    setSelectedFile(undefined);

    const validationError = await validatePdfFile(file);

    if (validationError) {
      toast.error(validationError);
      return;
    }

    setSelectedFile(file);
    event.currentTarget.value = "";
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(0)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8 pb-8">
      {/* Header */}
      <section>
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Upload className="h-6 w-6" />
        </div>

        <h1 className="text-3xl font-semibold tracking-tight">
          Upload documents
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Add your legal documents to Vakeel Vision. Once processed, you will be
          able to explore clauses, identify potential risks, and ask questions
          about their contents.
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        {/* Main upload section */}
        <div className="space-y-6">
          <section className="rounded-2xl border border-border bg-card p-5 sm:p-7">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h2 className="font-semibold">Choose your files</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Upload PDF documents for analysis
                </p>
              </div>

              <span className="rounded-lg border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground">
                PDF only
              </span>
            </div>

            {/* Dropzone */}
            {/* <div
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={(event) => {
                event.preventDefault();
                setIsDragging(false);
              }}
              onDrop={(event) => {
                event.preventDefault();
                setIsDragging(false);
                handleFiles(event.dataTransfer.files);
              }}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
              role="button"
              tabIndex={0}
              aria-label="Choose PDF documents"
              className={`flex min-h-64 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-5 py-10 text-center transition-colors ${
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-border bg-background hover:border-primary/60 hover:bg-muted/30"
              }`}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-card shadow-sm">
                <FolderUp className="h-7 w-7 text-primary" />
              </div>

              <h3 className="mt-5 font-medium">
                Drop your documents here
              </h3>

              <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                Drag and drop your PDF files, or click below to browse your
                computer.
              </p>

              <span className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-medium transition-colors hover:bg-muted">
                <Files className="h-4 w-4" />
                Browse files
              </span>

              <p className="mt-4 text-xs text-muted-foreground">
                PDF files only · Maximum size: 20 MB per file
              </p>
            </div> */}

            {/* <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              multiple
              className="hidden"
              onChange={(event) => {
                handleFiles(event.currentTarget?.f iles);
                event.currentTarget.value = "";
              }}
            /> */}
            <p>File</p>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              multiple={false}
              className=""
              onChange={handleFileChange}
            />

            {/* Selected files */}
            {selectedFile && (
              <div className="mt-6 space-y-3">
                {selectedFile && (
                  <div
                    key={`${selectedFile.name}-${selectedFile.size}`}
                    className="flex items-center gap-3 rounded-xl border border-border p-3"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <FileText className="h-5 w-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {selectedFile.name}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatSize(selectedFile.size)} · PDF
                      </p>
                    </div>

                    <Check className="h-4 w-4 shrink-0 text-emerald-600" />

                    <button
                      type="button"
                      aria-label={`Remove ${selectedFile.name}`}
                      onClick={() => {
                        fileInputRef.current!.value = "";
                        setSelectedFile(undefined)
                      }}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Non-functional action */}
            <div className="mt-6 flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-5 text-muted-foreground">
                {!selectedFile
                  ? "Select a file to preview your upload."
                  : `${selectedFile.name} selected. Upload is not enabled yet.`}
              </p>

              <button
                type="button"
                disabled={isPending}
                onClick={uploadFile}
                title="Upload functionality will be added later"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground"
              >
                <Upload className="h-4 w-4" />
                {isPending ? "Uploading...." : "Upload"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </section>

          {/* What happens next */}
          <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="font-semibold">What happens next?</h2>
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-3">
              <Step
                number="01"
                title="Extract text"
                description="Read the text and page structure from your PDF."
              />
              <Step
                number="02"
                title="Analyze clauses"
                description="Prepare document content for legal analysis."
              />
              <Step
                number="03"
                title="Start asking"
                description="Chat with your document and explore its contents."
              />
            </div>
          </section>
        </div>

        {/* Sidebar information */}
        <aside className="space-y-4">
          <section className="rounded-2xl border border-border bg-card p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
              <ShieldCheck className="h-5 w-5" />
            </div>

            <h2 className="mt-4 font-semibold">Your documents matter</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Legal documents can contain sensitive information. Upload
              documents only when you are comfortable sharing their contents
              with this application.
            </p>

            <div className="mt-4 flex items-start gap-2 rounded-xl bg-muted/50 p-3">
              <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <p className="text-xs leading-5 text-muted-foreground">
                This screen is a UI preview. Selected files remain in your
                browser session and are not sent to a server.
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold">Before you upload</h2>
            </div>

            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                Use PDF documents
              </li>
              <li className="flex gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                Ensure pages are readable
              </li>
              <li className="flex gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                Check for password protection
              </li>
            </ul>
          </section>

          <Link
            href="/documents"
            className="flex items-center justify-between rounded-2xl border border-border p-4 transition-colors hover:bg-card"
          >
            <div>
              <p className="text-sm font-medium">View your library</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Return to your documents
              </p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        </aside>
      </div>
    </div>
  );
}

function Step({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div>
      <p className="text-xs font-semibold tracking-widest text-primary">
        {number}
      </p>
      <h3 className="mt-2 text-sm font-medium">{title}</h3>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
