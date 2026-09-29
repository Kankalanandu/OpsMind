export type Severity = 'SEV-1' | 'SEV-2' | 'SEV-3' | 'SEV-4';
export type IncidentStatus = 'TRIGGERED' | 'INVESTIGATING' | 'MITIGATING' | 'RESOLVED';

export interface TelemetrySignals {
  latency: number; // in seconds (e.g. 5.1s)
  errorRate: number; // percentage (e.g. 16%)
  dbConnections: number; // percentage (e.g. 94%)
  cpuUtilization: number; // percentage (e.g. 62%)
  memoryUtilization: number; // percentage (e.g. 71%)
  requestsPerMin: number; // e.g. 14200
  history?: Array<{
    time: string;
    latency: number;
    errorRate: number;
    dbConnections: number;
  }>;
}

export interface IncidentTimelineEvent {
  id: string;
  time: string;
  title: string;
  description: string;
  type: 'alert' | 'deployment' | 'investigation' | 'memory' | 'action' | 'resolution';
}

export interface HistoricalMemory {
  id: string;
  incidentId: string;
  title: string;
  service: string;
  similarity: number; // 0 - 100 percentage
  symptoms: string[];
  rootCause: string;
  attemptedActions: string[];
  failedActions: string[];
  successfulAction: string;
  resolutionTime: string;
  lesson: string;
  deploymentVersion: string;
  environment: string;
  timestamp: string;
  type: 'experience' | 'observation' | 'world';
  tags: string[];
}

export interface InvestigationReasoning {
  step: string;
  status: 'pending' | 'in_progress' | 'completed';
  detail: string;
}

export interface IncidentInvestigation {
  summary: string;
  findings: string[];
  likelyCauses: string[];
  recommendedAction: string;
  why: string;
  evidence: string[];
  historicalMatches: HistoricalMemory[];
  confidence: 'High' | 'Medium' | 'Low';
  confidenceNote?: string;
  reasoningSteps: InvestigationReasoning[];
  hindsightTrace: {
    recalledCount: number;
    reflected: boolean;
    reflectSummary?: string;
    bankId: string;
    isLiveHindsight: boolean;
    latencyMs: number;
  };
}

export interface Incident {
  id: string;
  title: string;
  service: string;
  severity: Severity;
  status: IncidentStatus;
  environment: string;
  symptoms: string[];
  deploymentVersion: string;
  previousDeploymentVersion?: string;
  affectedUsersPercentage: number;
  signals: TelemetrySignals;
  timeline: IncidentTimelineEvent[];
  logs: string[];
  investigation?: IncidentInvestigation;
  rootCause?: string;
  resolution?: {
    actionTaken: string;
    resolvedAt: string;
    duration: string;
    engineerNotes: string;
  };
  learningRetained?: boolean;
  learningRetainedAt?: string;
  learningSummary?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LearningEvent {
  id: string;
  incidentId: string;
  title: string;
  service: string;
  lesson: string;
  confidence: 'High' | 'Medium' | 'Low';
  rootCause: string;
  successfulAction: string;
  failedActions: string[];
  createdAt: string;
  source: string;
  bankId: string;
  patternDetected?: string;
}

export interface PostMortem {
  id: string;
  incidentId: string;
  title: string;
  service: string;
  severity: Severity;
  impact: string;
  duration: string;
  timeline: IncidentTimelineEvent[];
  rootCause: string;
  contributingFactors: string[];
  actionsAttempted: string[];
  whatWorked: string;
  whatFailed: string;
  resolution: string;
  lessonsLearned: string[];
  preventiveActions: string[];
  retainedInHindsight: boolean;
  retainedAt?: string;
}

export interface Runbook {
  id: string;
  title: string;
  service: string;
  severity: Severity;
  symptoms: string[];
  checks: string[];
  recommendedActions: string[];
  historicalSuccessRate: number; // percentage
  isDemoData: boolean;
  lastUpdated: string;
}

export interface HindsightStatus {
  connected: boolean;
  isFallback: boolean;
  bankId: string;
  baseUrl: string;
  lastRetain: string | null;
  lastRecall: string | null;
  lastReflect: string | null;
  totalMemories: number;
  activeMission: string;
  error?: string | null;
}
