# OpsMind System Architecture

```
                  ┌────────────────────────────────────────────────────────┐
                  │                   Production Telemetry                 │
                  │   (P99 Latency, 5xx Error Rate, DB Pool, Deployments)  │
                  └───────────────────────────┬────────────────────────────┘
                                              │
                                              ▼
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                    OPSMIND AGENT                                        │
│                                                                                         │
│   1. Understand Symptoms & Release Chronology                                          │
│   2. Build Hindsight Semantic Query                                                     │
│   3. Recall Past Post-Mortems from Memory Bank "opsmind-production-memory"              │
│   4. Reflect & Reason over Past vs Present Evidence                                     │
│   5. Formulate Evidence-Backed Recommendation + Warn against Past Failed Actions        │
└──────────────┬───────────────────────────────────────────────────────────┬──────────────┘
               │                                                           │
               ▼                                                           ▼
┌──────────────────────────────┐                           ┌──────────────────────────────┐
│  HINDSIGHT SEMANTIC MEMORY   │                           │     ENGINEER IN THE LOOP     │
│                              │                           │                              │
│  • Bank: opsmind-production- │                           │  • Review Evidence & Why     │
│    memory                    │                           │  • Verify Git Diff / Fix     │
│  • Operations:               │                           │  • Trigger Remediation       │
│    - RETAIN (Post-Mortem)    │                           │  • Metrics Restore to SLA    │
│    - RECALL (Search Matches) │                           └──────────────┬───────────────┘
│    - REFLECT (Synthesize)    │                                          │
└──────────────▲───────────────┘                                          │
               │                                                          │
               └────────────────────── Retain Validated Lesson ───────────┘
```

## Core Components

1. **`server/hindsightService.ts`**:
   - Official client: `@vectorize-io/hindsight-client`
   - Memory Bank: `opsmind-production-memory`
   - Key Methods:
     - `retain(content, metadata)`: Stores structured incident memories.
     - `recall(query, options)`: Semantic retrieval of historical incidents with similarity scores.
     - `reflect(query, context)`: Reasoning over memory units and current telemetry.
     - Fallback: Transparent `isFallback` indicator for offline demo development.

2. **`server/agentOrchestrator.ts`**:
   - Synthesizes incident telemetry, queries Hindsight Recall, compares past and present version diffs, and prevents recurring troubleshooting errors.
   - Retains post-mortems back into Hindsight to complete the learning loop.

3. **Frontend Presentation Layer**:
   - `IncidentDetailView`: Centerpiece investigation panel with live telemetry and Hindsight Recall matches.
   - `JuryModeModal`: 60-second guided walk-through for rapid hackathon evaluation.
   - `MemoryExplorerView`: Interactive SVG Knowledge Network and Semantic Search.
   - `LearningCenterView`: Systemic pattern detection engine.
