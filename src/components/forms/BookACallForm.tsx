"use client";

import { useState } from "react";
import { CheckCircle } from "lucide-react";

interface Props {
  slug: string;
}

type Status = "idle" | "loading" | "success" | "error";

export default function BookACallForm({ slug }: Props) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    try {
      const res = await fetch(`/api/${slug}/book-a-call`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        setErrorMsg(json.error || "Terjadi kesalahan");
        setStatus("error");
        return;
      }

      setStatus("success");
    } catch {
      setErrorMsg("Gagal mengirim. Periksa koneksi internet Anda.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="text-center py-16 px-6">
        <CheckCircle
          className="mx-auto mb-4 text-green-500"
          size={56}
          strokeWidth={1.5}
        />
        <h2 className="text-xl font-bold text-text-primary mb-2">
          Permintaan Terkirim!
        </h2>
        <p className="text-text-secondary max-w-md mx-auto">
          Tim kami akan menghubungi Anda dalam 1-2 hari kerja untuk menjadwalkan
          sesi konsultasi.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Honeypot */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="absolute opacity-0 h-0 w-0 pointer-events-none"
      />

      {[
        { id: "nama", label: "Nama lengkap", type: "text", required: true, autoComplete: "name" },
        { id: "email", label: "Email", type: "email", required: true, autoComplete: "email" },
        { id: "whatsapp", label: "WhatsApp", type: "tel", required: true, autoComplete: "tel" },
        { id: "perusahaan", label: "Perusahaan", type: "text", required: true, autoComplete: "organization" },
        { id: "jabatan", label: "Jabatan", type: "text", required: true, autoComplete: "organization-title" },
      ].map((field) => (
        <div key={field.id}>
          <label
            htmlFor={field.id}
            className="block text-sm font-medium text-text-secondary mb-1.5"
          >
            {field.label}
            {field.required && (
              <span className="text-brand ml-0.5">*</span>
            )}
          </label>
          <input
            id={field.id}
            name={field.id}
            type={field.type}
            required={field.required}
            autoComplete={field.autoComplete}
            className="w-full h-11 rounded-md border border-border bg-white px-3 text-sm text-text-primary placeholder:text-text-placeholder focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none transition-colors"
          />
        </div>
      ))}

      <div>
        <label
          htmlFor="topik"
          className="block text-sm font-medium text-text-secondary mb-1.5"
        >
          Topik konsultasi (opsional)
        </label>
        <input
          id="topik"
          name="topik"
          type="text"
          className="w-full h-11 rounded-md border border-border bg-white px-3 text-sm text-text-primary placeholder:text-text-placeholder focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none transition-colors"
        />
      </div>

      <div>
        <label
          htmlFor="pesan"
          className="block text-sm font-medium text-text-secondary mb-1.5"
        >
          Pesan tambahan (opsional)
        </label>
        <textarea
          id="pesan"
          name="pesan"
          rows={3}
          className="w-full rounded-md border border-border bg-white px-3 py-2.5 text-sm text-text-primary placeholder:text-text-placeholder focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none transition-colors resize-none"
        />
      </div>

      {errorMsg && (
        <p className="text-sm text-brand">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full h-12 rounded-md bg-brand text-white text-sm font-medium hover:bg-brand-hover disabled:opacity-60 disabled:cursor-not-allowed transition-colors cursor-pointer"
      >
        {status === "loading" ? "Mengirim..." : "Book a Call"}
      </button>
    </form>
  );
}
