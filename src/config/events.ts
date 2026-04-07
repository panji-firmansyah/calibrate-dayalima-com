import type { EventConfig } from "@/types";

export const EVENTS: Record<string, EventConfig> = {
  calibrate: {
    name: "Calibrate Talent Diagnostic",
    tagline: "Ukur kematangan talent management organisasi Anda",
    table: "calibrate_submissions",
    status: "active",
    scale: {
      min: 1,
      max: 5,
      minLabel: "Sangat Tidak Yakin",
      maxLabel: "Sangat Yakin",
    },
    scoring: { method: "sum" },
    questions: [
      {
        id: "q1_hiring",
        label: "Hiring",
        type: "likert",
        scaleMin: 1,
        scaleMax: 5,
        text: "Seberapa yakin Anda bahwa proses rekrutmen organisasi Anda secara konsisten menghasilkan orang yang tepat — bukan hanya yang <em>qualified</em>?",
      },
      {
        id: "q2_activation",
        label: "Activation",
        type: "likert",
        scaleMin: 1,
        scaleMax: 5,
        text: "Seberapa efektif organisasi Anda dalam membuat <em>new hire</em> produktif dan <em>committed</em> dalam 90 hari pertama?",
      },
      {
        id: "q3_succession",
        label: "Succession",
        type: "likert",
        scaleMin: 1,
        scaleMax: 5,
        text: "Jika 3 orang terpenting di organisasi Anda resign bulan depan — seberapa siap Anda dengan penggantinya?",
      },
      {
        id: "q4_data",
        label: "Data",
        type: "likert",
        scaleMin: 1,
        scaleMax: 5,
        text: "Sejauh mana keputusan talent di organisasi Anda — <em>hiring</em>, promosi, <em>retention</em> — didasarkan pada data, bukan <em>feeling</em>?",
      },
      {
        id: "q5_integration",
        label: "Integration",
        type: "likert",
        scaleMin: 1,
        scaleMax: 5,
        text: "Seberapa terkoneksi proses <em>hiring</em>, <em>onboarding</em>, <em>performance</em>, dan <em>succession planning</em> di organisasi Anda?",
      },
    ],
    contactFields: [
      {
        id: "nama",
        label: "Nama lengkap",
        type: "text",
        placeholder: "Nama lengkap",
        required: true,
        autocomplete: "name",
      },
      {
        id: "perusahaan",
        label: "Perusahaan",
        type: "text",
        placeholder: "Nama perusahaan",
        required: true,
        autocomplete: "organization",
      },
      {
        id: "jabatan",
        label: "Jabatan",
        type: "text",
        placeholder: "Jabatan Anda",
        required: true,
        autocomplete: "organization-title",
      },
    ],
    tiers: [
      { name: "Fragmentaris", min: 5, max: 10, color: "#DC2626" },
      { name: "Berkembang", min: 11, max: 15, color: "#F59E0B" },
      { name: "Terstruktur", min: 16, max: 20, color: "#3B82F6" },
      { name: "Terintegrasi", min: 21, max: 25, color: "#22C55E" },
    ],
    features: {
      bookACall: true,
      dashboard: true,
      report: true,
    },
  },

  "exec-breakfast": {
    name: "Leadership Pulse",
    tagline: "Appreciation Breakfast Edition",
    table: "calibrate_submissions",
    status: "closed",
    scale: {
      min: 1,
      max: 5,
      minLabel: "Sangat Tidak Setuju",
      maxLabel: "Sangat Setuju",
    },
    scoring: { method: "sum" },
    questions: [
      {
        id: "q1_awareness",
        label: "Awareness",
        type: "likert",
        scaleMin: 1,
        scaleMax: 5,
        text: "Saya memahami perbedaan kebutuhan dan ekspektasi antar-generasi di tim saya.",
      },
      {
        id: "q2_komunikasi",
        label: "Communication",
        type: "likert",
        scaleMin: 1,
        scaleMax: 5,
        text: "Saya menyesuaikan gaya komunikasi saya berdasarkan siapa yang saya ajak bicara di tim.",
      },
      {
        id: "q3_shared_leadership",
        label: "Share Leadership",
        type: "likert",
        scaleMin: 1,
        scaleMax: 5,
        text: "Saya secara aktif memberi ruang bagi setiap anggota tim untuk berkontribusi berdasarkan kekuatan mereka, terlepas dari senioritas atau usia.",
      },
      {
        id: "q4_knowledge_flow",
        label: "Knowledge Flow",
        type: "likert",
        scaleMin: 1,
        scaleMax: 5,
        text: "Di tim saya, transfer pengetahuan terjadi dua arah — senior belajar dari junior, dan sebaliknya.",
      },
      {
        id: "q5_inklusi",
        label: "Inclusion & Belonging",
        type: "likert",
        scaleMin: 1,
        scaleMax: 5,
        text: "Setiap anggota tim, dari generasi manapun, merasa dihargai dan didengar.",
      },
    ],
    contactFields: [
      {
        id: "nama",
        label: "Nama lengkap",
        type: "text",
        placeholder: "Nama lengkap",
        required: true,
        autocomplete: "name",
      },
      {
        id: "perusahaan",
        label: "Perusahaan",
        type: "text",
        placeholder: "Nama perusahaan",
        required: true,
        autocomplete: "organization",
      },
      {
        id: "jabatan",
        label: "Jabatan",
        type: "text",
        placeholder: "Jabatan Anda",
        required: true,
        autocomplete: "organization-title",
      },
    ],
    tiers: [
      { name: "Fragmentaris", min: 5, max: 10, color: "#DC2626" },
      { name: "Berkembang", min: 11, max: 15, color: "#F59E0B" },
      { name: "Terstruktur", min: 16, max: 20, color: "#3B82F6" },
      { name: "Terintegrasi", min: 21, max: 25, color: "#22C55E" },
    ],
    dashboardLayout: "pulse-check",
    features: {
      bookACall: false,
      dashboard: true,
      report: false,
    },
  },
};

export function getEvent(slug: string): EventConfig | undefined {
  return EVENTS[slug];
}

export function getActiveEvents(): [string, EventConfig][] {
  return Object.entries(EVENTS).filter(([, e]) => e.status === "active");
}

export function getAllEvents(): [string, EventConfig][] {
  return Object.entries(EVENTS);
}
