"use client";

import { useRef } from "react";
import PdfExportButton from "./PdfExportButton";

interface Props {
  children: React.ReactNode;
}

export default function DashboardShell({ children }: Props) {
  const captureRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div ref={captureRef}>{children}</div>
      <div className="flex justify-center mt-8">
        <PdfExportButton captureRef={captureRef} />
      </div>
    </>
  );
}
