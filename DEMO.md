# OpsMind Hackathon Demonstration Script (Jury Guide)

## Goal
Demonstrate to judges in under 90 seconds that OpsMind remembers previous production failures and behaves visibly smarter on subsequent incidents.

---

## ⏱️ Step-by-Step Jury Walkthrough (60–90 Seconds)

### Step 1: Open Jury Mode
Click the **"Jury Mode"** button in the top navigation bar or the left sidebar.

### Step 2: Slide 1 & 2 — The Critical Alert
- Show the detected incident: Payments API latency spikes to 5.1s, 16% error rate, 94% DB pool saturation.
- OpsMind activates and analyzes current evidence (deployment `v4.2.3` released 12 minutes ago).

### Step 3: Slide 3 & 4 — Hindsight Memory Recall
- OpsMind calls `client.recall()` on memory bank `opsmind-production-memory`.
- **Match Found**: `INC-104` (91% similarity).
- Historical memory confirms root cause was a connection leak in webhook error branch.
- **Critical Memory Insight**: In `INC-104`, attempting to restart pods or scale replicas FAILED and worsened database connection starvation from 96% to 100%!

### Step 4: Slide 5 & 6 — Past vs Present Reasoning
- OpsMind does not blindly copy the old fix:
  > *"This incident resembles INC-104, but the deployment is v4.2.3 rather than v4.2.1. I recommend checking the recent database connection-handling changes before performing a rollback."*
- OpsMind warns against replica scaling.

### Step 5: Slide 7 & 8 — Human in the Loop & Resolution
- Engineer approves the recommended action.
- Latency restores to 118ms and DB connections drop to 26%.

### Step 6: Slide 9 & 10 — Retaining the Learning
- OpsMind automatically retains the post-mortem into Hindsight (`client.retain()`).
- Final core tagline:
  > *"Every incident teaches the organization something. OpsMind makes sure the organization never forgets."*

---

## 🛠️ Two-Incident Live Comparison

1. **Click Incident 1 (`INC-104`)**:
   - First occurrence of connection leak.
   - Shows heuristic synthesis without prior direct organizational memory.
   - Click "Rollback v4.2.1" → Resolves and retains memory into Hindsight.

2. **Click Incident 2 (`INC-137`)**:
   - Immediate 91% recall of `INC-104`.
   - Live display of previously failed actions to save critical MTTR minutes.
