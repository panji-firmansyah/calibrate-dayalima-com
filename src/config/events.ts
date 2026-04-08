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
    quiz: {
      title: "GENERASI MANA?",
      subtitle: "Prejudice Quiz",
      choices: [
        "Baby Boomers (1946–1964)",
        "Gen X (1965–1980)",
        "Millennials (1981–1996)",
        "Gen Z (1997–2012)",
      ],
      questions: [
        {
          id: 1,
          stereotype:
            "Tidak loyal — sering pindah-pindah kerja.",
          commonBias: "Gen Z / Millennials",
          reveal:
            "Semua generasi pindah kerja di usia 20-an dengan frekuensi yang serupa. Rata-rata tenure pekerja muda konsisten lintas generasi — ini soal tahap karir, bukan karakter generasi.",
          source:
            'Bureau of Labor Statistics; McKinsey "Gen What?" (2023)',
        },
        {
          id: 2,
          stereotype:
            "Gagap teknologi — susah adaptasi digital.",
          commonBias: "Baby Boomers",
          reveal:
            "Baby Boomers dan Gen X aktif belajar teknologi baru. Senior business leaders justru menghabiskan lebih banyak waktu mempelajari emerging technology dibanding yang lebih junior.",
          source: "McKinsey Digital (2023)",
        },
        {
          id: 3,
          stereotype: "Malas — kurang motivasi kerja.",
          commonBias: "Gen Z",
          reveal:
            "49% Gen Z menganggap pekerjaan vital bagi identitas mereka. 62% Millennials menganggap kerja lebih penting dari hobi, musik, bahkan olahraga. Work ethic serupa di semua generasi.",
          source:
            "Deloitte Gen Z and Millennials Survey (2023)",
        },
        {
          id: 4,
          stereotype:
            "Terlalu sensitif — gampang baper di tempat kerja.",
          commonBias: "Millennials / Gen Z",
          reveal:
            'Yang sering disebut "baper" sebenarnya adalah boundary-setting — kemampuan menetapkan batasan. Riset menunjukkan ini justru meningkatkan produktivitas dan mencegah burnout, bukan tanda kelemahan.',
          source: "Harvard Business Review (2022)",
        },
        {
          id: 5,
          stereotype:
            "Kerja cuma untuk uang — materialistis.",
          commonBias: "Gen Z",
          reveal:
            "Kebalikannya: Gen Z justru generasi yang paling sedikit memprioritaskan kompensasi sebagai alasan bertahan di perusahaan. Semakin tua, semakin tinggi prioritas terhadap gaji.",
          source:
            'McKinsey "Gen What? Debunking Age-Based Myths" (2023)',
        },
        {
          id: 6,
          stereotype:
            "Tidak mau berubah — kaku dan kolot.",
          commonBias: "Baby Boomers / Gen X",
          reveal:
            "Resistance to change bukan soal generasi — ini soal personality, konteks organisasi, dan seberapa baik perubahan dikomunikasikan. Meta-analisis 2024 menunjukkan generasi bukan prediktor signifikan terhadap sikap terhadap perubahan.",
          source:
            "Ravid et al., Journal of Organizational Behavior (2024)",
        },
        {
          id: 7,
          stereotype:
            "Mau enaknya saja — terlalu fokus work-life balance.",
          commonBias: "Millennials",
          reveal:
            "Semua generasi menginginkan work-life balance — dari Boomers sampai Gen Z. Ini kebutuhan universal manusia, bukan monopoli satu generasi.",
          source:
            "McKinsey (2023); HBR (2022)",
        },
        {
          id: 8,
          stereotype:
            "Kurang menghargai senior — sopan santunnya kurang.",
          commonBias: "Gen Z",
          reveal:
            "Yang terjadi adalah beda cara ekspresi hormat, bukan kurang hormat. Generasi muda terbiasa dengan efisiensi digital — langsung ke poin. Di budaya Indonesia, ini kadang dianggap kurang sopan, padahal intensinya sama: menghargai waktu atasan.",
          source:
            "UNECE Generational Diversity Report (2025)",
        },
        {
          id: 9,
          stereotype:
            "Mementingkan diri sendiri — self-centered.",
          commonBias: "Millennials",
          reveal:
            '75% Millennials percaya bisnis harus berdampak positif ke masyarakat. Mereka aktif memprioritaskan meaningful work di atas gaji. Stereotip "self-centered" muncul dari misinterpretasi atas kebutuhan mereka untuk punya purpose.',
          source:
            "Deloitte Millennial Survey; HBR (2022)",
        },
        {
          id: 10,
          stereotype:
            "Hanya bisa produktif kalau diawasi terus.",
          commonBias: "Gen Z",
          reveal:
            "Gen Z justru menghargai otonomi dan ownership. Micromanagement menurunkan performa mereka secara signifikan. 89% Gen Z bahkan terbuka soal gaji ke rekan kerja — transparansi, bukan pengawasan, yang memotivasi mereka.",
          source:
            "McKinsey (2023); LinkedIn Workforce Survey",
        },
      ],
      closing: {
        headline:
          "Dari 10 stereotip tadi — berapa yang asumsi Anda cocok dengan data?",
        insight:
          'Kebanyakan stereotip generasi tidak didukung data. Yang kita anggap "masalah generasi" sering kali adalah masalah tahap karir, personality, budaya organisasi, atau komunikasi.',
        bridge:
          "Sekarang, mari kita lihat data dari ruangan ini sendiri...",
      },
    },
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
