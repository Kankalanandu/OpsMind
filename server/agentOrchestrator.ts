import { HistoricalMemory, Incident, IncidentInvestigation, LearningEvent, PostMortem } from '../src/types/index.ts';
import { geminiService } from './geminiService.ts';
import { hindsightService } from './hindsightService.ts';
import { DEMO_INCIDENT_1, DEMO_INCIDENT_2, INITIAL_INCIDENTS, INITIAL_LEARNINGS } from './mockData.ts';

class AgentOrchestrator {
  private incidents: Map<string, Incident> = new Map();
  private learnings: LearningEvent[] = [...INITIAL_LEARNINGS];

  constructor() {
    this.seedData();
  }

  private seedData() {
    this.incidents.clear();
    INITIAL_INCIDENTS.forEach(inc => {
      this.incidents.set(inc.id, JSON.parse(JSON.stringify(inc)));
    });
  }

  public resetDemo() {
    this.seedData();
    this.learnings = [...INITIAL_LEARNINGS];
    hindsightService.resetToDefaults();
  }

  public getIncidents(): Incident[] {
    return Array.from(this.incidents.values());
  }

  public getIncident(id: string): Incident | undefined {
    return this.incidents.get(id);
  }

  public createIncident(data: Partial<Incident>): Incident {
    const id = data.id || `INC-${Math.floor(100 + Math.random() * 900)}`;
    const newIncident: Incident = {
      id,
      title: data.title || 'Untitled Incident',
      service: data.service || 'Payments API',
      severity: data.severity || 'SEV-1',
      status: 'INVESTIGATING',
      environment: data.environment || 'Production',
      symptoms: data.symptoms || ['Elevated latency', '5xx errors'],
      deploymentVersion: data.deploymentVersion || 'v1.0.0',
      previousDeploymentVersion: data.previousDeploymentVersion || 'v0.9.0',
      affectedUsersPercentage: data.affectedUsersPercentage || 20,
      signals: data.signals || {
        latency: 4.5,
        errorRate: 15,
        dbConnections: 92,
        cpuUtilization: 65,
        memoryUtilization: 70,
        requestsPerMin: 12000
      },
      timeline: [
        {
          id: `t-${Date.now()}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          title: 'Incident Detected',
          description: `Telemetry alerted on anomalous metrics in ${data.service || 'service'}`,
          type: 'alert'
        }
      ],
      logs: data.logs || ['[WARN] Latency threshold breached', '[ERROR] Upstream timeout'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.incidents.set(id, newIncident);
    return newIncident;
  }

  /**
   * Main AI Investigation Workflow:
   * 1. Understand current symptoms, deployment, and signals
   * 2. Formulate Hindsight Recall query
   * 3. Retrieve relevant historical memories
   * 4. Call Hindsight Reflect / synthesize contextual reasoning
   * 5. Generate evidence-backed recommendation
   */
  public async investigate(incidentId: string): Promise<IncidentInvestigation> {
    const incident = this.incidents.get(incidentId);
    if (!incident) {
      throw new Error(`Incident ${incidentId} not found`);
    }

    const currentBankId = hindsightService.getStatus().bankId || 'OpsMind';
    const recallQuery = `Find previous production incidents involving ${incident.service}, elevated latency, 5xx errors, database connection saturation, and deployment-related regressions.`;
    
    // Call Hindsight RECALL
    const recallResult = await hindsightService.recall(recallQuery, {
      service: incident.service,
      limit: 3
    });

    const isIncident2 = incident.id === 'INC-137' || incident.title.includes('INC-137') || incident.deploymentVersion === 'v4.2.3';
    const isIncident1 = incident.id === 'INC-104';

    let investigation: IncidentInvestigation;

    if (isIncident2) {
      // INCIDENT 2: Deep organizational memory recall of INC-104
      const historicalMemory = recallResult.memories.find(m => m.incidentId === 'INC-104') || recallResult.memories[0];

      investigation = {
        summary: `Incident resembles historical INC-104 pattern (91% relevance), but current release is v4.2.3 (vs v4.2.1). DB connection pool is 94% saturated.`,
        findings: [
          `Deployment v4.2.3 rolled out 12 minutes before the P99 latency spike (5.1s) and 16% error rate.`,
          `PostgreSQL connection pool reached 94% utilization with 42 client queries waiting in queue.`,
          `Historical memory INC-104 records an identical failure pattern: webhook connection leak introduced by deployment release.`,
          `CRITICAL WARNING: Historical incident INC-104 recorded that restarting pods or scaling replicas FAILED and escalated pool exhaustion to 100%.`
        ],
        likelyCauses: [
          'Database connection leak introduced in v4.2.3 connection pool lifecycle',
          'Missing client.release() in new checkout finalize webhook handler',
          'Cascading thread starvation from unreleased idle connections'
        ],
        recommendedAction: 'Inspect connection lifecycle changes introduced in v4.2.3 before rollback. Avoid pod restart or replica scaling.',
        why: 'Current incident occurred 12 minutes after deployment v4.2.3. Historical memory INC-104 confirms replica scaling worsens pool exhaustion.',
        evidence: [
          'DB connection pool: 94% (baseline: 24%)',
          'Deployment timing: 12 minutes elapsed since v4.2.3 deploy',
          'pg_stat_activity: 88 idle in transaction connections from payments worker',
          'Historical match: INC-104 (91% relevance) had identical symptom signature'
        ],
        historicalMatches: recallResult.memories,
        confidence: 'High',
        confidenceNote: 'High confidence based on 91% similarity with validated INC-104 post-mortem in Hindsight.',
        reasoningSteps: [
          { step: 'Telemetry Signal Analysis', status: 'completed', detail: 'Analyzed latency (5.1s), 16% error rate, and 94% DB connection saturation.' },
          { step: 'Deployment Correlation', status: 'completed', detail: 'Detected v4.2.3 deployment 12 minutes prior to anomaly.' },
          { step: 'Hindsight Memory Recall', status: 'completed', detail: `Retrieved ${recallResult.memories.length} relevant historical experiences from ${currentBankId}.` },
          { step: 'Past vs Present Reflect Reasoning', status: 'completed', detail: 'Identified INC-104 match (91%). Reasoned that while symptoms match, v4.2.3 git diff should be verified before immediate rollback.' },
          { step: 'Action Plan Formulation', status: 'completed', detail: 'Formulated recommendation and flagged previous failed actions (pod restart / scaling) to avoid recurring mistakes.' }
        ],
        hindsightTrace: {
          recalledCount: recallResult.memories.length,
          reflected: true,
          reflectSummary: 'Reasoned over INC-104 resolution: rollback was effective, replica scaling failed.',
          bankId: currentBankId,
          isLiveHindsight: recallResult.isLiveHindsight,
          latencyMs: recallResult.latencyMs
        }
      };
    } else if (isIncident1) {
      // INCIDENT 1: First encounter scenario - no direct prior memory
      investigation = {
        summary: `Analyzing current production evidence. No directly matching organizational memory found for this failure signature.`,
        findings: [
          `Payments API P99 latency breached SLO (4.8s) alongside 18% HTTP 5xx responses.`,
          `Deployment v4.2.1 completed 11 minutes prior to alert initiation.`,
          `Database connection pool is at 96% capacity with multiple PoolExhaustionError entries.`,
          `No historical incident in organizational memory matches this exact symptom profile.`
        ],
        likelyCauses: [
          'Database connection exhaustion',
          'Deployment regression in release v4.2.1',
          'Database connection leak in application code',
          'Upstream traffic anomaly'
        ],
        recommendedAction: 'Investigate recent deployment v4.2.1 connection handling or initiate rollback to stable v4.2.0.',
        why: 'Deployment timing directly correlates with latency spike and DB pool saturation.',
        evidence: [
          'Latency: 4.8s (Baseline: 120ms)',
          'Error Rate: 18% 5xx',
          'DB Pool Saturation: 96%',
          'Deployment: v4.2.1 completed 11m prior'
        ],
        historicalMatches: recallResult.memories.filter(m => m.similarity < 85),
        confidence: 'Medium',
        confidenceNote: 'Medium confidence due to lack of prior organizational incident experience.',
        reasoningSteps: [
          { step: 'Telemetry Signal Analysis', status: 'completed', detail: 'Detected sharp inflection in DB connection count and latency.' },
          { step: 'Deployment Check', status: 'completed', detail: 'Found v4.2.1 deploy 11 minutes prior.' },
          { step: 'Hindsight Memory Search', status: 'completed', detail: `Queried bank ${currentBankId}. No exact match found (new failure pattern).` },
          { step: 'Heuristic Synthesis', status: 'completed', detail: 'Correlated deployment timing with connection exhaustion.' },
          { step: 'Recommendation Output', status: 'completed', detail: 'Suggested deployment investigation and rollback option.' }
        ],
        hindsightTrace: {
          recalledCount: 1,
          reflected: true,
          reflectSummary: 'No direct prior experience found in memory bank. Operating from general SRE heuristics.',
          bankId: currentBankId,
          isLiveHindsight: recallResult.isLiveHindsight,
          latencyMs: recallResult.latencyMs
        }
      };
    } else {
      // Generic / Other incidents (e.g. INC-142, INC-145)
      investigation = {
        summary: `Investigation conducted for ${incident.service} (${incident.severity}). Correlated signals with historical memory.`,
        findings: [
          `Symptoms: ${incident.symptoms.join(', ')}`,
          `Affected users: ${incident.affectedUsersPercentage}%`,
          `Current signals: Latency ${incident.signals.latency}s, Error ${incident.signals.errorRate}%`
        ],
        likelyCauses: [
          'Resource saturation or downstream dependency degradation',
          'Configuration or deployment mismatch',
          'Rate limiting threshold breach'
        ],
        recommendedAction: `Inspect service telemetry and execute ${incident.service} runbook RB-0${Math.floor(1 + Math.random() * 4)}.`,
        why: 'Telemetry signals indicate localized throughput degradation.',
        evidence: [
          `CPU: ${incident.signals.cpuUtilization}%`,
          `Memory: ${incident.signals.memoryUtilization}%`,
          `Latency: ${incident.signals.latency}s`
        ],
        historicalMatches: recallResult.memories,
        confidence: 'Medium',
        reasoningSteps: [
          { step: 'Signal Intake', status: 'completed', detail: 'Parsed telemetry metrics.' },
          { step: 'Memory Recall', status: 'completed', detail: `Recalled ${recallResult.memories.length} historical experiences from ${currentBankId}.` },
          { step: 'Plan Formulation', status: 'completed', detail: 'Generated recommendation based on service telemetry.' }
        ],
        hindsightTrace: {
          recalledCount: recallResult.memories.length,
          reflected: true,
          bankId: currentBankId,
          isLiveHindsight: recallResult.isLiveHindsight,
          latencyMs: recallResult.latencyMs
        }
      };
    }

    // Optionally augment with Gemini if available
    if (geminiService.isEnabled()) {
      try {
        const aiPrompt = `Incident: ${incident.id} - ${incident.title}
Service: ${incident.service}
Symptoms: ${incident.symptoms.join(', ')}
Historical memories: ${JSON.stringify(recallResult.memories.slice(0, 2))}
Provide a 1-sentence succinct SRE recommendation.`;
        const geminiSummary = await geminiService.generateReasoning(aiPrompt);
        if (geminiSummary) {
          investigation.summary = geminiSummary.trim();
        }
      } catch (e) {
        // graceful
      }
    }

    // Attach to incident
    incident.investigation = investigation;
    incident.status = 'INVESTIGATING';
    incident.updatedAt = new Date().toISOString();
    this.incidents.set(incidentId, incident);

    return investigation;
  }

  /**
   * Resolve an incident
   */
  public resolve(incidentId: string, actionTaken: string, engineerNotes?: string): Incident {
    const incident = this.incidents.get(incidentId);
    if (!incident) throw new Error(`Incident ${incidentId} not found`);

    incident.status = 'RESOLVED';
    incident.resolution = {
      actionTaken: actionTaken || 'Executed recommended mitigation',
      resolvedAt: new Date().toISOString(),
      duration: '8m 42s',
      engineerNotes: engineerNotes || 'Mitigation applied successfully. All metrics restored to healthy thresholds.'
    };

    // Normalize signals to healthy
    incident.signals.latency = 0.118;
    incident.signals.errorRate = 0.05;
    incident.signals.dbConnections = 26;

    incident.timeline.push({
      id: `t-${Date.now()}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      title: 'Incident Resolved',
      description: `Action: ${actionTaken}. Latency reduced to 118ms, DB connections dropped to 26%.`,
      type: 'resolution'
    });

    incident.updatedAt = new Date().toISOString();
    this.incidents.set(incidentId, incident);
    return incident;
  }

  /**
   * RETAIN LEARNING: The crucial step of the learning loop!
   * Retains the incident post-mortem and validated resolution into Hindsight memory bank.
   */
  public async learn(incidentId: string): Promise<LearningEvent> {
    const incident = this.incidents.get(incidentId);
    if (!incident) throw new Error(`Incident ${incidentId} not found`);

    const rootCause = incident.rootCause || 
      (incident.id === 'INC-104' 
        ? 'Database connection leak introduced in deployment v4.2.1 due to missing client.release() in checkout webhook error handler.' 
        : `Connection lifecycle regression in ${incident.service} deployment ${incident.deploymentVersion}.`);

    const successfulAction = incident.resolution?.actionTaken || 'Rollback deployment';
    const failedActions = incident.id === 'INC-104' 
      ? ['Restart API instances', 'Increase replicas from 6 to 12'] 
      : ['Restart pods without code hotfix'];

    const lessonText = incident.id === 'INC-104'
      ? 'Deployment v4.2.1 introduced abnormal connection retention in webhook handler. Scaling replicas accelerates pool depletion during leaks. Fast rollback is superior to pod restart.'
      : `Deployment ${incident.deploymentVersion} connection regression confirmed. Pod scaling fails to relieve pool exhaustion when application leaks connections.`;

    // Retain to HINDSIGHT
    const retainResult = await hindsightService.retain(
      `Incident ${incident.id} Resolution: ${rootCause}. Successful fix: ${successfulAction}. Lesson: ${lessonText}`,
      {
        incidentId: incident.id,
        service: incident.service,
        rootCause,
        successfulAction,
        failedActions,
        deploymentVersion: incident.deploymentVersion,
        lesson: lessonText,
        tags: [incident.service.toLowerCase(), 'post-mortem', 'connection-pool', 'regression']
      }
    );

    const currentBankId = hindsightService.getStatus().bankId || 'OpsMind';
    const learningEvent: LearningEvent = {
      id: `LRN-${Date.now()}`,
      incidentId: incident.id,
      title: `${incident.service} ${incident.deploymentVersion} learning retained`,
      service: incident.service,
      lesson: lessonText,
      confidence: 'High',
      rootCause,
      successfulAction,
      failedActions,
      createdAt: new Date().toISOString(),
      source: `${incident.id} Post-Mortem`,
      bankId: currentBankId,
      patternDetected: 'Connection pool saturation pattern verified and indexed in Hindsight.'
    };

    this.learnings.unshift(learningEvent);

    incident.learningRetained = true;
    incident.learningRetainedAt = new Date().toISOString();
    incident.learningSummary = lessonText;
    incident.timeline.push({
      id: `t-${Date.now()}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      title: 'Hindsight Memory Retained',
      description: `New organizational memory created in bank ${currentBankId}. (Live Hindsight: ${retainResult.isLiveHindsight})`,
      type: 'memory'
    });

    this.incidents.set(incidentId, incident);
    return learningEvent;
  }

  public getLearnings(): LearningEvent[] {
    return this.learnings;
  }

  public generatePostMortem(incidentId: string): PostMortem {
    const incident = this.incidents.get(incidentId);
    if (!incident) throw new Error(`Incident ${incidentId} not found`);

    return {
      id: `PM-${incident.id}`,
      incidentId: incident.id,
      title: `Post-Mortem: ${incident.title}`,
      service: incident.service,
      severity: incident.severity,
      impact: `${incident.affectedUsersPercentage}% of checkout users affected. P99 latency peaked at ${incident.signals.latency}s.`,
      duration: incident.resolution?.duration || '8m 42s',
      timeline: incident.timeline,
      rootCause: incident.rootCause || 'Database connection leak introduced in deployment release due to unreleased client in error handler branch.',
      contributingFactors: [
        'Missing unit test for webhook error branch database client disposal',
        'Aggressive replica scaling that congested the PostgreSQL connection pooler',
        'Lack of statement_timeout fail-safe at the pool level'
      ],
      actionsAttempted: [
        'Pod fleet restart (FAILED - reconnected immediately with same leak)',
        'Replica scaling from 6 to 12 (FAILED - accelerated connection pool exhaustion to 100%)',
        `${incident.resolution?.actionTaken || 'Rollback deployment'} (SUCCESS - cleared connection leak)`
      ],
      whatWorked: `Immediate rollback of deployment ${incident.deploymentVersion} freed leaked connections and restored latency to 118ms.`,
      whatFailed: 'Restarting pods and scaling replicas did not fix the root cause and amplified database connection starvation.',
      resolution: `Deployment reverted. Database connection pool returned to baseline 26% utilization.`,
      lessonsLearned: [
        'Never scale replicas during an application connection leak — it multiplies leaked connections against database limits.',
        'Hindsight memory retention ensures the next on-call engineer does not repeat the replica-scaling mistake.',
        'Add automated static analysis rule to enforce try-finally client.release() in all async handlers.'
      ],
      preventiveActions: [
        'Enforce ESLint rule for pg-pool client release checks in CI pipeline',
        'Configure PgBouncer default statement_timeout = 5000ms',
        'Set up automated canary rollback when connection pool utilization climbs > 85%'
      ],
      retainedInHindsight: !!incident.learningRetained,
      retainedAt: incident.learningRetainedAt
    };
  }

  public async askOpsMind(incidentId: string | null, question: string): Promise<string> {
    const incident = incidentId ? this.incidents.get(incidentId) : null;
    
    // Recall relevant memory from Hindsight
    const recall = await hindsightService.recall(question, {
      service: incident?.service,
      limit: 2
    });

    const topMemory = recall.memories[0];

    // If Gemini is available, answer with high-level AI reasoning
    if (geminiService.isEnabled()) {
      try {
        const prompt = `User question: "${question}"
Current Incident Context: ${incident ? JSON.stringify({ id: incident.id, title: incident.title, service: incident.service, signals: incident.signals }) : 'General SRE query'}
Hindsight Organizational Memory: ${topMemory ? `Memory ${topMemory.incidentId}: ${topMemory.title}. Root Cause: ${topMemory.rootCause}. Successful fix: ${topMemory.successfulAction}. Failed fixes: ${topMemory.failedActions.join(', ')}. Lesson: ${topMemory.lesson}` : 'No exact memory'}
Answer as OpsMind, the self-learning production incident intelligence agent. Reference historical experience and specific evidence. Be authoritative and concise.`;
        const aiAnswer = await geminiService.generateReasoning(prompt);
        if (aiAnswer) return aiAnswer.trim();
      } catch (err) {
        // fallback
      }
    }

    // Intelligent heuristic answer
    const qLower = question.toLowerCase();
    if (qLower.includes('what happened') || qLower.includes('summary')) {
      if (incident) {
        return `Incident ${incident.id} is affecting ${incident.service}. P99 latency has spiked to ${incident.signals.latency}s with ${incident.signals.errorRate}% error rate and ${incident.signals.dbConnections}% DB connection saturation. This was correlated with deployment ${incident.deploymentVersion} released 12 minutes ago.`;
      }
      return 'OpsMind is actively monitoring production services. Systems are stable with 1 SEV-1 active incident under investigation.';
    }

    if (qLower.includes('have we seen') || qLower.includes('seen this before') || qLower.includes('history')) {
      if (topMemory) {
        return `Yes. Hindsight memory recalled ${topMemory.incidentId} (${topMemory.title}) with ${topMemory.similarity}% relevance. That incident also suffered from database connection exhaustion caused by a connection leak in deployment ${topMemory.deploymentVersion}.`;
      }
      return 'No identical incident pattern found in memory bank. This appears to be a novel failure profile.';
    }

    if (qLower.includes('what worked') || qLower.includes('how was it fixed')) {
      if (topMemory) {
        return `In ${topMemory.incidentId}, the successful resolution was: "${topMemory.successfulAction}". Note that attempting to restart the pods or scale replicas FAILED and worsened database connection starvation.`;
      }
      return 'Historical resolutions for database saturation typically involve transaction-level pooling or deployment rollback.';
    }

    if (qLower.includes('rollback') || qLower.includes('why rollback') || qLower.includes('why are you recommending')) {
      return `Deployment ${incident?.deploymentVersion || 'v4.2.3'} occurred 12 minutes before the latency spike. In historical incident INC-104, rolling back the regression restored latency from 4.8s to 118ms within 4 minutes. However, because current version is v4.2.3, OpsMind recommends verifying connection lifecycle changes before triggering rollback.`;
    }

    if (qLower.includes('investigate next') || qLower.includes('what should i')) {
      return `Next step: Inspect connection lifecycle changes in ${incident?.deploymentVersion || 'v4.2.3'} and check pg_stat_activity for idle in transaction count. Do NOT scale replicas, as organizational memory proves this exhausts remaining DB connection headroom.`;
    }

    return `OpsMind analyzed historical memory: ${topMemory ? `INC-${topMemory.incidentId} had similar root cause (${topMemory.rootCause}). Successful fix was ${topMemory.successfulAction}.` : 'Searching Hindsight organizational knowledge.'}`;
  }
}

export const agentOrchestrator = new AgentOrchestrator();
