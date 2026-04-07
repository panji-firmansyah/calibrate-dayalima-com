// ============================================================
// Question Types — discriminated union, extensible
// ============================================================

export type QuestionType = "likert" | "multiple-choice";

interface BaseQuestion {
  id: string;
  label: string;
  text: string;
  type: QuestionType;
}

export interface LikertQuestionDef extends BaseQuestion {
  type: "likert";
  scaleMin: number;
  scaleMax: number;
}

export interface MultipleChoiceQuestionDef extends BaseQuestion {
  type: "multiple-choice";
  options: { value: number; label: string }[];
}

export type Question = LikertQuestionDef | MultipleChoiceQuestionDef;

// ============================================================
// Scale & Scoring Config
// ============================================================

export interface ScaleConfig {
  min: number;
  max: number;
  minLabel: string;
  maxLabel: string;
}

export interface ScoringConfig {
  method: "sum" | "weighted" | "percentage";
  weights?: Record<string, number>;
  maxScore?: number;
}

// ============================================================
// Tiers
// ============================================================

export interface TierDef {
  name: string;
  min: number;
  max: number;
  color: string;
}

// ============================================================
// Event Config
// ============================================================

export interface ContactField {
  id: string;
  label: string;
  type: "text" | "email" | "tel";
  placeholder: string;
  required: boolean;
  autocomplete?: string;
}

export interface EventConfig {
  name: string;
  tagline: string;
  table: string;
  status: "active" | "closed" | "upcoming";
  questions: Question[];
  contactFields: ContactField[];
  scale: ScaleConfig;
  scoring: ScoringConfig;
  tiers: TierDef[];
  dashboardLayout?: "default" | "pulse-check";
  features: {
    bookACall: boolean;
    dashboard: boolean;
    report: boolean;
  };
}

// ============================================================
// Data Models
// ============================================================

export interface Submission {
  id: string;
  event_id: string;
  nama: string;
  perusahaan: string;
  jabatan: string;
  scores: Record<string, number>;
  total_score: number;
  created_at: string;
}

export interface Participant {
  id: string;
  event_id: string;
  participant_number: number;
  nama: string;
  perusahaan: string;
  jabatan: string;
  meja: string;
  pic_table: string;
  attended: string;
  diagnostic_filled: string;
  scores: Record<string, number> | null;
  total: number | null;
  band: string;
  area_terkuat: string;
  area_prioritas: string;
  gap: number;
  gap_text: string;
  integration_text: string;
  benchmark: Record<string, number> | null;
  expert_bands: Record<string, string> | null;
  bd_notes: string | null;
  rc_notes: string;
  diagnostic_summary: string;
  created_at: string;
}
