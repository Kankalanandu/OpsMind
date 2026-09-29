import { HistoricalMemory, Incident, LearningEvent, Runbook } from '../src/types/index.ts';

export const INITIAL_MEMORIES: HistoricalMemory[] = [
  {
    id: 'MEM-104',
    incidentId: 'INC-104',
    title: 'Payments API latency spike & connection saturation',
    service: 'Payments API',
    similarity: 91,
    symptoms: [
      'API latency 4.8 seconds (p99: 8.2s)',
      '18% 5xx HTTP response error rate',
      'PostgreSQL connection pool at 96% saturation',
      'Began 11 minutes after release deployment v4.2.1'
    ],
    rootCause: 'Database connection leak introduced in deployment v4.2.1 due to missing client.release() in checkout webhook handler.',
    attemptedActions: ['Restart API instances', 'Increase ECS replicas from 6 to 12', 'Restart database primary pooler'],
    failedActions: [
      'Restart API instances (connections immediately re-saturated upon boot)',
      'Increase ECS replicas (worsened DB connection exhaustion from 96% to 100%)'
    ],
    successfulAction: 'Rollback deployment v4.2.1 to v4.2.0',
    resolutionTime: '8m 42s',
    lesson: 'Deployment v4.2.1 introduced abnormal connection retention. Scaling replicas accelerates pool depletion during leaks. Instant rollback is superior to pod restart.',
    deploymentVersion: 'v4.2.1',
    environment: 'Production',
    timestamp: '2026-08-14T14:11:00Z',
    type: 'experience',
    tags: ['payments', 'database', 'connection-pool', 'leak', 'rollback']
  },
  {
    id: 'MEM-087',
    incidentId: 'INC-087',
    title: 'PostgreSQL connection pool saturation under high concurrency',
    service: 'Database Cluster',
    similarity: 84,
    symptoms: [
      'API latency 3.9 seconds',
      'Database connection pool at 98%',
      'PgBouncer connection queue spike > 450 clients',
      'High client connection timeout count'
    ],
    rootCause: 'Max client connections misconfigured in PgBouncer pooler following replica rebalance.',
    attemptedActions: ['Kill idle DB sessions', 'Increase PgBouncer pool_size from 50 to 120'],
    failedActions: ['Kill idle DB sessions (active queries re-saturated pool within 45s)'],
    successfulAction: 'Updated PgBouncer pool_mode to transaction and bumped pool_size to 150',
    resolutionTime: '14m 20s',
    lesson: 'Session-level pooling caused pool starvation under burst traffic. Transaction-level pooling sustains 4x concurrency.',
    deploymentVersion: 'v4.1.8',
    environment: 'Production',
    timestamp: '2026-07-29T10:30:00Z',
    type: 'experience',
    tags: ['database', 'pgbouncer', 'pool-exhaustion', 'concurrency']
  },
  {
    id: 'MEM-061',
    incidentId: 'INC-061',
    title: 'Database statement timeout on unindexed ledger query',
    service: 'Payments API',
    similarity: 72,
    symptoms: [
      'API latency 6.2 seconds',
      '12% 504 Gateway Timeouts',
      'DB active sessions waiting on Lock:relation',
      'CPU saturation on read replica'
    ],
    rootCause: 'Full table scan on payments_ledger table missing composite index on (tenant_id, created_at).',
    attemptedActions: ['Terminate blocking queries', 'Add CONCURRENTLY index in production'],
    failedActions: ['Terminate blocking queries (recurring traffic reproduced the lock within 2m)'],
    successfulAction: 'Created composite index concurrently and enabled query statement timeout',
    resolutionTime: '22m 15s',
    lesson: 'Slow table scans cascade into connection pool starvation. Always enforce 5s statement_timeout in application pool.',
    deploymentVersion: 'v4.0.4',
    environment: 'Production',
    timestamp: '2026-06-18T18:45:00Z',
    type: 'experience',
    tags: ['payments', 'query-timeout', 'indexing', 'lock']
  },
  {
    id: 'MEM-118',
    incidentId: 'INC-118',
    title: 'Redis Cluster failover timeout and connection burst',
    service: 'Redis Cache',
    similarity: 68,
    symptoms: [
      'Auth Gateway latency 2.4s',
      'Redis client ECONNREFUSED on node-03',
      'Session lookup cache miss rate surged to 100%'
    ],
    rootCause: 'Redis primary node OOM due to unrestricted TTL on ephemeral session keys.',
    attemptedActions: ['Flush non-critical keys', 'Promote replica node-03-b'],
    failedActions: ['Flush non-critical keys (node became unresponsive during FLUSHDB)'],
    successfulAction: 'Triggered failover to secondary replica and applied allkeys-lru eviction policy',
    resolutionTime: '9m 10s',
    lesson: 'Missing maxmemory-policy led to hard crash. Always configure allkeys-lru and monitor fragmentation ratio.',
    deploymentVersion: 'v2.8.0',
    environment: 'Production',
    timestamp: '2026-08-20T08:12:00Z',
    type: 'experience',
    tags: ['redis', 'cache', 'failover', 'eviction']
  },
  {
    id: 'MEM-122',
    incidentId: 'INC-122',
    title: 'Kafka Consumer Lag in payment notification pipeline',
    service: 'Kafka Pipeline',
    similarity: 64,
    symptoms: [
      'Notification Service lag > 1.2M unconsumed records',
      'Payment receipts delayed by 45 minutes',
      'Consumer rebalance storm'
    ],
    rootCause: 'Long processing time per batch caused consumer heartbeat timeout and repeated rebalancing.',
    attemptedActions: ['Add 10 more consumer pods', 'Increase max.poll.interval.ms'],
    failedActions: ['Add 10 more consumer pods (triggered even more rebalance cascades)'],
    successfulAction: 'Increased max.poll.interval.ms to 600s and reduced max.poll.records to 50',
    resolutionTime: '17m 50s',
    lesson: 'Scaling consumer pods during a rebalance storm worsens partition churn. Fix heartbeat intervals first.',
    deploymentVersion: 'v3.1.2',
    environment: 'Production',
    timestamp: '2026-08-25T16:04:00Z',
    type: 'experience',
    tags: ['kafka', 'consumer-lag', 'rebalance', 'streaming']
  },
  {
    id: 'MEM-129',
    incidentId: 'INC-129',
    title: 'Auth Gateway CPU saturation and JWT verification bottleneck',
    service: 'Auth Gateway',
    similarity: 59,
    symptoms: [
      'CPU saturation 98% across all Auth pods',
      'HTTP 503 Service Unavailable on /oauth/token',
      'P99 latency jumped from 45ms to 3.8s'
    ],
    rootCause: 'JWKS key rotation failed silently, forcing cryptographic verification fallback per request without local cache.',
    attemptedActions: ['Restart Auth pods', 'Increase HPA max replicas to 30'],
    failedActions: ['Restart Auth pods (pods immediately pegged CPU at 100% on startup)'],
    successfulAction: 'Restored JWKS caching proxy and warm public keys memory cache',
    resolutionTime: '11m 30s',
    lesson: 'Cold JWKS lookups will melt CPU under heavy traffic. Ensure stale-while-revalidate key caching.',
    deploymentVersion: 'v5.1.0',
    environment: 'Production',
    timestamp: '2026-09-02T11:20:00Z',
    type: 'experience',
    tags: ['auth', 'jwt', 'cpu-saturation', 'jwks']
  },
  {
    id: 'MEM-095',
    incidentId: 'INC-095',
    title: 'Cache Stampede on Product Inventory Service',
    service: 'Inventory Service',
    similarity: 55,
    symptoms: [
      'Simultaneous 500 errors on flash sale products',
      'Database connection pool overwhelmed by duplicate queries',
      'Inventory count latency spike to 4.1s'
    ],
    rootCause: 'Product cache key expired during active campaign without mutual exclusion locking (mutex).',
    attemptedActions: ['Clear cache and reboot', 'Increase DB read replicas'],
    failedActions: ['Clear cache (worsened stampede by sending 100% load to DB)'],
    successfulAction: 'Deployed Redis distributed lock (Redlock) with probabilistic early expiration (XFetch)',
    resolutionTime: '15m 45s',
    lesson: 'Never clear cache during a stampede. Use single-flight query coalescing and probabilistic early TTL.',
    deploymentVersion: 'v2.4.9',
    environment: 'Production',
    timestamp: '2026-08-05T09:15:00Z',
    type: 'experience',
    tags: ['inventory', 'cache-stampede', 'redlock', 'xfetch']
  },
  {
    id: 'MEM-112',
    incidentId: 'INC-112',
    title: 'Search Service Elasticsearch heap exhaustion',
    service: 'Search Service',
    similarity: 51,
    symptoms: [
      'Search query latency > 7.5s',
      'Elasticsearch CircuitBreakerException: [parent] Data too large',
      'Garbage collection pauses exceeding 12 seconds'
    ],
    rootCause: 'Wildcard prefix query `*query*` allowed without length restriction, ballooning fielddata cache.',
    attemptedActions: ['Restart Elasticsearch master node', 'Double JVM heap'],
    failedActions: ['Restart master node (split brain scenario nearly triggered during indexing)'],
    successfulAction: 'Applied WAF rate limit and blocked unanchored leading wildcard queries',
    resolutionTime: '19m 30s',
    lesson: 'Never permit leading wildcard regex queries on unindexed text fields.',
    deploymentVersion: 'v3.8.1',
    environment: 'Production',
    timestamp: '2026-08-16T15:22:00Z',
    type: 'experience',
    tags: ['search', 'elasticsearch', 'heap', 'circuit-breaker']
  },
  {
    id: 'MEM-074',
    incidentId: 'INC-074',
    title: 'Orders API goroutine leak under downstream timeout',
    service: 'Orders API',
    similarity: 49,
    symptoms: [
      'Orders API memory creeping from 1.2GB to 14GB',
      'OOMKilled pods restarting cyclically',
      'Stuck HTTP client connections'
    ],
    rootCause: 'HTTP client missing response body Close() when downstream payment provider timed out.',
    attemptedActions: ['Increase pod memory limits from 2Gi to 8Gi'],
    failedActions: ['Increase memory limits (only postponed OOM kill by 20 minutes)'],
    successfulAction: 'Hotfixed defer resp.Body.Close() and configured HTTP Client IdleConnTimeout',
    resolutionTime: '24m 10s',
    lesson: 'Memory leaks cannot be cured by increasing memory limits. Check connection cleanup and leak patterns.',
    deploymentVersion: 'v4.1.0',
    environment: 'Production',
    timestamp: '2026-07-12T13:40:00Z',
    type: 'experience',
    tags: ['orders', 'memory-leak', 'goroutines', 'timeout']
  },
  {
    id: 'MEM-131',
    incidentId: 'INC-131',
    title: 'User Service rate limiter cascading failure',
    service: 'User Service',
    similarity: 46,
    symptoms: [
      '429 Too Many Requests sent to valid authenticated users',
      'Token bucket state corrupted across distributed pods'
    ],
    rootCause: 'Redis sliding window script had a race condition on millisecond epoch timestamps.',
    attemptedActions: ['Bypass rate limiter globally', 'Flush rate limit keys'],
    failedActions: ['Bypass rate limiter (allowed unauthorized scrapers to degrade backend)'],
    successfulAction: 'Switched to Redis token bucket with atomic EVALSHA Lua script',
    resolutionTime: '13m 40s',
    lesson: 'Rate limit scripts must be atomic. Always have a graceful degradation degraded-mode toggle.',
    deploymentVersion: 'v2.9.4',
    environment: 'Production',
    timestamp: '2026-09-08T07:50:00Z',
    type: 'experience',
    tags: ['user-service', 'rate-limit', 'redis-lua', 'concurrency']
  }
];

export const DEMO_INCIDENT_1: Incident = {
  id: 'INC-104',
  title: 'Payments API latency spike & elevated 5xx errors',
  service: 'Payments API',
  severity: 'SEV-1',
  status: 'RESOLVED',
  environment: 'Production',
  symptoms: [
    'API latency 4.8 seconds (baseline: 120ms)',
    '18% 5xx HTTP response error rate',
    'PostgreSQL connection pool at 96% saturation',
    'Started 11 minutes after deployment v4.2.1',
    'Affected checkout users: 31%'
  ],
  deploymentVersion: 'v4.2.1',
  previousDeploymentVersion: 'v4.2.0',
  affectedUsersPercentage: 31,
  signals: {
    latency: 4.8,
    errorRate: 18,
    dbConnections: 96,
    cpuUtilization: 58,
    memoryUtilization: 68,
    requestsPerMin: 12800,
    history: [
      { time: '14:00', latency: 0.12, errorRate: 0.1, dbConnections: 24 },
      { time: '14:05', latency: 0.13, errorRate: 0.1, dbConnections: 26 },
      { time: '14:10', latency: 0.15, errorRate: 0.2, dbConnections: 28 },
      { time: '14:11', latency: 0.85, errorRate: 2.4, dbConnections: 52 },
      { time: '14:15', latency: 2.90, errorRate: 8.5, dbConnections: 78 },
      { time: '14:20', latency: 4.80, errorRate: 18.0, dbConnections: 96 }
    ]
  },
  timeline: [
    { id: 't1', time: '14:09', title: 'Deployment Completed', description: 'Deployment v4.2.1 rolled out to Payments API fleet (6 pods)', type: 'deployment' },
    { id: 't2', time: '14:12', title: 'Latency Alert Triggered', description: 'Datadog alert: Payments API P99 latency exceeded 2.5s threshold', type: 'alert' },
    { id: 't3', time: '14:14', title: 'OpsMind Investigation Began', description: 'Agent initiated evidence synthesis. Organizational memory check: 0 exact matches for this new endpoint.', type: 'investigation' },
    { id: 't4', time: '14:16', title: 'Potential Causes Analyzed', description: 'Database pool exhaustion, connection leak, traffic anomaly evaluated.', type: 'investigation' },
    { id: 't5', time: '14:18', title: 'Engineer Executed Rollback', description: 'Engineer triggered rollback to v4.2.0 based on deployment timing correlation.', type: 'action' },
    { id: 't6', time: '14:22', title: 'Incident Resolved', description: 'DB connections dropped to 28%, latency normalized to 118ms.', type: 'resolution' },
    { id: 't7', time: '14:23', title: 'Hindsight Memory Retained', description: 'OpsMind retained INC-104 root cause (connection leak in v4.2.1) to memory bank opsmind-production-memory.', type: 'memory' }
  ],
  logs: [
    '[14:11:02] [Payments-Pod-3] INFO: Deployment v4.2.1 active',
    '[14:12:15] [Payments-Pod-1] WARN: db.pool acquiring connection took 3420ms',
    '[14:13:40] [Payments-Pod-2] ERROR: PoolExhaustionError: timeout 5000ms waiting for available connection (active: 96/100)',
    '[14:14:10] [Payments-Pod-4] ERROR: 500 POST /v1/payments/charge - pool client checkout timed out',
    '[14:15:30] [Payments-Pod-3] WARN: webhook handler failed to release client back to pool on unexpected payload'
  ],
  rootCause: 'Database connection leak introduced in deployment v4.2.1 due to missing client.release() in checkout webhook error handler.',
  resolution: {
    actionTaken: 'Rollback deployment v4.2.1 to v4.2.0',
    resolvedAt: '2026-08-14T14:22:00Z',
    duration: '8m 42s',
    engineerNotes: 'Attempting to scale replicas increased DB load from 96% to 100%. Rolling back v4.2.1 cleared the leak immediately.'
  },
  learningRetained: true,
  learningRetainedAt: '2026-08-14T14:23:00Z',
  learningSummary: 'Rollback v4.2.1 resolves connection exhaustion caused by the deployment connection lifecycle. Pod restart and replica scaling fail because new pods also leak connections.',
  createdAt: '2026-08-14T14:12:00Z',
  updatedAt: '2026-08-14T14:23:00Z'
};

export const DEMO_INCIDENT_2: Incident = {
  id: 'INC-137',
  title: 'Payments API latency spike and connection exhaustion',
  service: 'Payments API',
  severity: 'SEV-1',
  status: 'INVESTIGATING',
  environment: 'Production',
  symptoms: [
    'API latency 5.1 seconds (p99: 9.4s)',
    '16% 5xx HTTP response error rate',
    'PostgreSQL connection pool at 94% saturation',
    'Started 12 minutes after deployment v4.2.3',
    'Affected checkout users: 28%'
  ],
  deploymentVersion: 'v4.2.3',
  previousDeploymentVersion: 'v4.2.2',
  affectedUsersPercentage: 28,
  signals: {
    latency: 5.1,
    errorRate: 16,
    dbConnections: 94,
    cpuUtilization: 62,
    memoryUtilization: 71,
    requestsPerMin: 14200,
    history: [
      { time: '14:00', latency: 0.11, errorRate: 0.05, dbConnections: 22 },
      { time: '14:05', latency: 0.12, errorRate: 0.08, dbConnections: 24 },
      { time: '14:10', latency: 0.14, errorRate: 0.12, dbConnections: 25 },
      { time: '14:12', latency: 0.92, errorRate: 3.10, dbConnections: 58 },
      { time: '14:16', latency: 3.10, errorRate: 9.20, dbConnections: 82 },
      { time: '14:20', latency: 5.10, errorRate: 16.0, dbConnections: 94 }
    ]
  },
  timeline: [
    { id: 't1', time: '14:02', title: 'Deployment Completed', description: 'Deployment v4.2.3 released to Payments API fleet', type: 'deployment' },
    { id: 't2', time: '14:04', title: 'P99 Latency Alert', description: 'Payments API latency surged past 2.0s SLO threshold', type: 'alert' },
    { id: 't3', time: '14:05', title: 'OpsMind Investigation Triggered', description: 'Agent query sent to Hindsight memory bank: searching for connection pool saturation and deployment regressions.', type: 'investigation' },
    { id: 't4', time: '14:05', title: 'Historical Experience Found', description: 'Hindsight recalled INC-104 (91% similarity) and INC-087 (84% similarity).', type: 'memory' },
    { id: 't5', time: '14:07', title: 'Contextual Reasoning Formulated', description: 'OpsMind cross-referenced historical connection leak pattern with current v4.2.3 changes.', type: 'investigation' }
  ],
  logs: [
    '[14:02:18] [Payments-Pod-1] INFO: Swapped container to image: payments-api:v4.2.3',
    '[14:04:32] [Payments-Pod-4] WARN: db connection checkout wait: 4120ms',
    '[14:06:01] [Payments-Pod-2] ERROR: PoolExhaustionError: 94/100 connections allocated, 42 queued queries',
    '[14:08:15] [Payments-Pod-5] ERROR: HTTP 503 Service Unavailable on /checkout/v2/finalize',
    '[14:09:44] [Payments-Pod-1] WARN: pg_stat_activity shows 88 idle in transaction connections from payments worker'
  ],
  createdAt: '2026-09-29T14:04:00Z',
  updatedAt: '2026-09-29T14:08:00Z'
};

export const INITIAL_INCIDENTS: Incident[] = [
  DEMO_INCIDENT_2,
  {
    id: 'INC-142',
    title: 'Notification Service message queue backpressure',
    service: 'Notification Service',
    severity: 'SEV-2',
    status: 'INVESTIGATING',
    environment: 'Production',
    symptoms: [
      'Kafka consumer lag: 650,000 messages',
      'SMS delivery delay > 12 minutes',
      'Downstream provider rate limit 429'
    ],
    deploymentVersion: 'v3.4.1',
    affectedUsersPercentage: 14,
    signals: {
      latency: 1.8,
      errorRate: 6.5,
      dbConnections: 45,
      cpuUtilization: 78,
      memoryUtilization: 64,
      requestsPerMin: 8900
    },
    timeline: [
      { id: 't1', time: '13:30', title: 'Lag Threshold Breached', description: 'Kafka topic notifications.push breached 500k queue depth', type: 'alert' }
    ],
    logs: [
      '[13:31:02] [Notify-Worker-1] WARN: Provider Twilio returned 429 Too Many Requests',
      '[13:32:45] [Notify-Worker-3] INFO: Exponential backoff throttled to 50 msg/sec'
    ],
    createdAt: '2026-09-29T13:30:00Z',
    updatedAt: '2026-09-29T13:45:00Z'
  },
  {
    id: 'INC-145',
    title: 'Auth Gateway JWKS key cache miss and CPU spike',
    service: 'Auth Gateway',
    severity: 'SEV-3',
    status: 'INVESTIGATING',
    environment: 'Production',
    symptoms: [
      'CPU utilization 82%',
      'Auth token verification latency 420ms',
      'JWKS cache misses on token refresh'
    ],
    deploymentVersion: 'v5.2.0',
    affectedUsersPercentage: 6,
    signals: {
      latency: 0.42,
      errorRate: 2.1,
      dbConnections: 38,
      cpuUtilization: 82,
      memoryUtilization: 59,
      requestsPerMin: 22000
    },
    timeline: [
      { id: 't1', time: '12:15', title: 'High CPU Alert', description: 'Auth Gateway cluster CPU utilization exceeded 80% threshold', type: 'alert' }
    ],
    logs: [
      '[12:15:10] [Auth-Pod-2] WARN: Local JWKS cache expired, fetching from IDP',
      '[12:16:04] [Auth-Pod-1] INFO: RSA signature verification throughput 1200 ops/sec'
    ],
    createdAt: '2026-09-29T12:15:00Z',
    updatedAt: '2026-09-29T12:30:00Z'
  },
  DEMO_INCIDENT_1
];

export const INITIAL_LEARNINGS: LearningEvent[] = [
  {
    id: 'LRN-001',
    incidentId: 'INC-104',
    title: 'Payment API connection leak pattern identified',
    service: 'Payments API',
    lesson: 'Deployment v4.2.1 introduced abnormal connection retention in webhook handler. Scaling replicas accelerates pool depletion during leaks. Fast rollback is superior to pod restart.',
    confidence: 'High',
    rootCause: 'Connection leak introduced in v4.2.1',
    successfulAction: 'Rollback deployment v4.2.1',
    failedActions: ['Restart API', 'Increase replicas'],
    createdAt: '2026-08-14T14:23:00Z',
    source: 'INC-104 Post-Mortem',
    bankId: 'opsmind-production-memory',
    patternDetected: 'Connection pool saturation pattern: 3 incidents in 30 days'
  },
  {
    id: 'LRN-002',
    incidentId: 'INC-087',
    title: 'PgBouncer session vs transaction pooling behavior',
    service: 'Database Cluster',
    lesson: 'Session-level pooling causes rapid pool exhaustion under high concurrency bursts. Transaction-level pooling sustains 4x higher traffic with minimal queue depth.',
    confidence: 'High',
    rootCause: 'Session mode connection starvation',
    successfulAction: 'Switch PgBouncer to transaction mode with pool_size 150',
    failedActions: ['Kill idle DB sessions'],
    createdAt: '2026-07-29T10:45:00Z',
    source: 'INC-087 Post-Mortem',
    bankId: 'opsmind-production-memory',
    patternDetected: 'Database connection configuration vulnerability'
  },
  {
    id: 'LRN-003',
    incidentId: 'INC-118',
    title: 'Redis maxmemory eviction policy resilience',
    service: 'Redis Cache',
    lesson: 'Unrestricted key creation without explicit TTL causes sudden OOM crashes during failovers. allkeys-lru eviction prevents node unresponsiveness.',
    confidence: 'High',
    rootCause: 'Redis OOM from unbounded ephemeral keys',
    successfulAction: 'Failover to replica and apply allkeys-lru policy',
    failedActions: ['FLUSHDB during peak traffic'],
    createdAt: '2026-08-20T08:30:00Z',
    source: 'INC-118 Post-Mortem',
    bankId: 'opsmind-production-memory',
    patternDetected: 'Cache memory exhaustion recurrence'
  },
  {
    id: 'LRN-004',
    incidentId: 'INC-122',
    title: 'Kafka consumer scaling during rebalance storm',
    service: 'Kafka Pipeline',
    lesson: 'Adding consumer pods during an active rebalance storm amplifies partition churn. Always increase max.poll.interval.ms before adjusting pod count.',
    confidence: 'Medium',
    rootCause: 'Heartbeat timeout from oversized consumer batch size',
    successfulAction: 'Increase max.poll.interval.ms to 600s and throttle batch size',
    failedActions: ['Add 10 more consumer pods'],
    createdAt: '2026-08-25T16:20:00Z',
    source: 'INC-122 Post-Mortem',
    bankId: 'opsmind-production-memory'
  }
];

export const INITIAL_RUNBOOKS: Runbook[] = [
  {
    id: 'RB-01',
    title: 'Database Connection Pool Exhaustion',
    service: 'Payments API / Database Cluster',
    severity: 'SEV-1',
    symptoms: [
      'Database connection pool > 90%',
      'API latency spike > 3 seconds',
      'PoolExhaustionError in logs'
    ],
    checks: [
      'Inspect pg_stat_activity for idle in transaction count',
      'Check if recent deployment occurred within last 30 minutes',
      'Verify whether query wait queue is climbing',
      'Examine Hindsight organizational memory for previous connection leak patterns'
    ],
    recommendedActions: [
      'If recent deployment occurred: inspect connection lifecycle or initiate immediate rollback',
      'DO NOT blindly scale replicas (worsens DB pool exhaustion)',
      'Temporarily enable statement_timeout = 5000ms to clear stuck transactions',
      'Check PgBouncer client pool saturation'
    ],
    historicalSuccessRate: 94,
    isDemoData: true,
    lastUpdated: '2026-08-22T10:00:00Z'
  },
  {
    id: 'RB-02',
    title: 'API Latency Spike & 5xx Error Mitigation',
    service: 'Payments API / Orders API',
    severity: 'SEV-1',
    symptoms: [
      'P99 latency > 2.5s',
      '5xx error rate > 5%',
      'Upstream gateway timeouts'
    ],
    checks: [
      'Determine if latency originates in database, network, or external provider',
      'Cross-reference deployment history across all microservices',
      'Check CPU & memory saturation across pod fleet'
    ],
    recommendedActions: [
      'Enable circuit breakers on slow downstream dependencies',
      'Route 20% non-critical read traffic to replica cluster',
      'Review OpsMind investigation recommendation'
    ],
    historicalSuccessRate: 88,
    isDemoData: true,
    lastUpdated: '2026-08-18T14:30:00Z'
  },
  {
    id: 'RB-03',
    title: 'Redis Cluster Node Failover & Timeout',
    service: 'Redis Cache',
    severity: 'SEV-2',
    symptoms: [
      'Cache read timeouts > 500ms',
      'ECONNREFUSED errors on primary master',
      'Memory utilization > 95%'
    ],
    checks: [
      'Check Redis INFO memory fragmentation ratio',
      'Verify replica replication lag',
      'Examine keyspace TTL distributions'
    ],
    recommendedActions: [
      'Promote designated replica node using CLUSTER FAILOVER TAKEOVER',
      'Verify application connection pool reconnects smoothly',
      'Enforce allkeys-lru eviction policy'
    ],
    historicalSuccessRate: 91,
    isDemoData: true,
    lastUpdated: '2026-08-25T09:15:00Z'
  },
  {
    id: 'RB-04',
    title: 'Kafka Consumer Lag and Partition Rebalance Storm',
    service: 'Kafka Pipeline',
    severity: 'SEV-2',
    symptoms: [
      'Consumer lag > 500,000 messages',
      'Frequent group rebalancing messages',
      'Heartbeat timeout warnings'
    ],
    checks: [
      'Inspect max.poll.interval.ms vs actual batch processing time',
      'Check for poison pill records blocking topic partitions'
    ],
    recommendedActions: [
      'DO NOT spin up new consumers during rebalance',
      'Increase max.poll.interval.ms and decrease max.poll.records',
      'Direct poison pill messages to Dead Letter Queue (DLQ)'
    ],
    historicalSuccessRate: 85,
    isDemoData: true,
    lastUpdated: '2026-09-01T11:00:00Z'
  },
  {
    id: 'RB-05',
    title: 'Deployment Regression Rapid Rollback',
    service: 'All Services',
    severity: 'SEV-1',
    symptoms: [
      'Degradation correlated within 15 minutes of Canary or Fleet deploy',
      'Error rate delta > +10%'
    ],
    checks: [
      'Compare git commit diff between target version and previous stable tag',
      'Confirm DB migration reversibility'
    ],
    recommendedActions: [
      'Trigger ArgoCD / Helm automated rollback to previous validated image',
      'Verify traffic drains cleanly from crashing pods',
      'Capture heap and thread dump before terminating instances'
    ],
    historicalSuccessRate: 96,
    isDemoData: true,
    lastUpdated: '2026-09-10T16:00:00Z'
  }
];
