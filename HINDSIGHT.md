# Hindsight Memory Integration in OpsMind

OpsMind integrates the official `@vectorize-io/hindsight-client` library to power its persistent organizational memory.

## Configuration

```bash
HINDSIGHT_BASE_URL="https://api.hindsight.vectorize.io"
HINDSIGHT_API_KEY="your-hindsight-api-key"
HINDSIGHT_BANK_ID="opsmind-production-memory"
```

## Operations Used

### 1. RETAIN (`client.retain`)
Used whenever an incident is resolved and a post-mortem is validated. Stores:
- Incident ID & Title
- Root Cause
- Attempted & Failed Mitigations
- Validated Fix
- Deployment Version & Timestamps
- Organizational Lesson

```typescript
await client.retain(bankId, content, {
  timestamp: new Date(),
  context: `Incident ${incidentId} post-mortem resolution`,
  metadata: {
    incidentId,
    service,
    rootCause,
    successfulAction,
    lesson
  },
  tags: ['incident', service.toLowerCase()]
});
```

### 2. RECALL (`client.recall`)
Used during the AI investigation stage to search memory for matching failure patterns:

```typescript
const response = await client.recall(bankId, query, {
  budget: 'mid'
});
```

### 3. REFLECT (`client.reflect`)
Used to reason across retrieved memories and formulate contextual hypotheses:

```typescript
const response = await client.reflect(bankId, query, {
  context: telemetryContext,
  budget: 'mid'
});
```

## Fallback & Transparency

When external Hindsight credentials are not set, OpsMind automatically operates in **Demo Memory Mode**. The fallback is transparently exposed in the UI and `/api/status` endpoint so judges and developers always know the connection status.
