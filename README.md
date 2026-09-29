# OPSMIND
## Self-Learning Production Incident Intelligence Agent

> *"Every incident teaches the organization something. OpsMind makes sure the organization never forgets."*

OpsMind is an enterprise SRE/DevOps incident intelligence agent powered by **Hindsight** semantic memory. Traditional AI models treat every outage as a blank slate. OpsMind anchors real-time telemetry analysis in persistent organizational experience: understanding what failed in the past, what worked, and formulating evidence-backed mitigation plans.

---

## 🏆 Key Features

- **The Hindsight Learning Loop**: Current Incident → Understand → Recall Historical Memory → Reflect & Compare → Evidence-First Recommendation → Human-in-the-Loop Action → Retain Validated Post-Mortem into Hindsight.
- **The Killer Two-Incident Demo**:
  - **Incident 1 (`INC-104`)**: First encounter of a database connection leak in deployment `v4.2.1`. OpsMind starts without direct memory, guides investigation, resolves it via rollback, and retains the post-mortem into Hindsight.
  - **Incident 2 (`INC-137`)**: Similar symptoms 6 weeks later in `v4.2.3`. OpsMind recalls `INC-104` with 91% similarity, identifies the connection leak pattern, highlights that replica scaling previously worsened the outage, and recommends inspecting connection lifecycle code before rollback.
- **Jury Mode (60–90 Second Walkthrough)**: A 10-step progress-driven storytelling mode specifically built for hackathon evaluation.
- **Organizational Memory Explorer**: Full semantic search over the `opsmind-production-memory` memory bank, interactive visual knowledge network, and timeline graph.
- **Production SRE Interface**: Dark, high-density, real-time telemetry graphs (P99 Latency, Error Rate, DB Connection Saturation, CPU, Throughput).

---

## 🏗️ Architecture

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons.
- **Backend**: Node.js, Express, TSX, Vite Middleware.
- **Persistent Semantic Memory**: `@vectorize-io/hindsight-client` with dedicated bank `opsmind-production-memory`.
- **Reasoning**: Hindsight `reflect()` + `@google/genai` (Gemini 2.5 Flash).

---

## 🚀 Environment Variables & Setup

Create a `.env` file from `.env.example`:

```bash
# Hindsight Configuration
HINDSIGHT_BASE_URL="https://api.hindsight.vectorize.io"
HINDSIGHT_API_KEY="your-hindsight-api-key"
HINDSIGHT_BANK_ID="opsmind-production-memory"

# Gemini AI (Optional AI reasoning enrichment)
GEMINI_API_KEY="your-gemini-api-key"
```

*Note: If Hindsight API credentials are not provided or offline, OpsMind automatically engages Demo Memory Mode with high-fidelity local memory store, clearly labeled in the UI and status bar.*
###Demo: https://opsmind-self-learning-incident-intelligence-agent.ai.studio/
### Run Locally

```bash
# Install dependencies
npm install

# Start development server on port 3000
npm run dev
```

---

## 🧪 Demonstration Flow

1. Click **Jury Mode** from the top header or sidebar.
2. Step through the 10-slide story in under 90 seconds.
3. Open the **AI Investigator** for `INC-137` to witness live Hindsight Recall & Reflect.
4. Open the **Memory Explorer** to query *"database connection failures"*.
