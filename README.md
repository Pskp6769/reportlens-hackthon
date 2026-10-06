# ReportLens — AI-Assisted Radiology Report Analysis

Auditable clinical decision-support layer for multi-page radiology reports. Every conclusion is traceable, safety-checked, and clinically prioritized.

---

## Setup

```bash
cd reportlens
npm install
```

## Environment Configuration

Create a `.env.local` file:

```bash
cp .env.example .env.local
```

Configure your Anthropic API key:

```env
ANTHROPIC_API_KEY=sk-ant-api03-...
```

*(Note: If `ANTHROPIC_API_KEY` is omitted, ReportLens automatically falls back to its built-in deterministic clinical NLP safety engine so offline demos and tests never crash).*

## Run Command

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. Click **"⚡ 30s Judge Demo"** to run the instant end-to-end flow.

---

## 30-Second Architecture Explanation

```
Radiology PDF Upload
      ↓
Page-Aware Text Extraction (pdf-parse / multi-page segmenter)
      ↓
Claude 3.5 Sonnet Structured Extraction (System-enforced JSON)
      ↓
Strict Zod Validation (Guaranteed data contract)
      ↓
Deterministic Safety Layer (flagCriticalFindings + Negation Engine)
      ├── Filters false positives (e.g., "No pneumothorax" vs "Pneumothorax")
      └── Cross-checks Findings vs. Impression discordance
      ↓
Clinical Urgency Engine (🔴 Critical / 🟠 Urgent / Normal)
      ↓
Auditable Workstation Dashboard
      ├── Click-to-source verbatim sentence highlighting
      ├── Interactive Findings, Impression, & Recommendations
      └── Structured FHIR-ready JSON export
```
