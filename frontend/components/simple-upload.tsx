"use client";

import type React from "react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload } from "lucide-react";

export function SimpleUpload({ user_id }: { user_id: number }) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selected, setSelected] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "done" | "error">(
    "idle"
  );

  const onChoose = () => inputRef.current?.click();

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setSelected(file ?? null);
  };

  const onUpload = async () => {
    if (!selected) return;
    setStatus("uploading");

    try {
      const formData = new FormData();
      formData.append("file", selected);
      formData.append("user_id", user_id.toString());

      const res = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      setStatus("done");

      setTimeout(() => {
        setSelected(null);
        setStatus("idle");
      }, 800);
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-base">Upload PDF</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={onFile}
        />
        <Button
          variant="outline"
          className="w-full justify-center bg-transparent"
          onClick={onChoose}
        >
          <Upload className="h-4 w-4 mr-2" />
          Choose PDF
        </Button>
        <div className="text-sm text-muted-foreground min-h-5">
          {selected ? `Selected: ${selected.name}` : "No file chosen"}
        </div>
        <Button
          className="w-full"
          disabled={!selected || status === "uploading"}
          onClick={onUpload}
        >
          {status === "uploading" ? "Uploading..." : "Upload"}
        </Button>
        {status === "done" && (
          <p className="text-sm text-green-600">Upload complete</p>
        )}
        {status === "error" && (
          <p className="text-sm text-red-600">Upload failed</p>
        )}
      </CardContent>
    </Card>
  );
}