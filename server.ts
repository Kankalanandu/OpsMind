import dotenv from 'dotenv';
dotenv.config({ override: true });

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { agentOrchestrator } from './server/agentOrchestrator.ts';
import { hindsightService } from './server/hindsightService.ts';
import { INITIAL_RUNBOOKS } from './server/mockData.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Initialize Hindsight connection / memory bank
  await hindsightService.initBank().catch(() => {});

  // ==========================================
  // API ROUTES
  // ==========================================

  // System & Hindsight Status
  app.get('/api/status', (req, res) => {
    const hindsightStatus = hindsightService.getStatus();
    res.json({
      status: 'operational',
      environment: 'PRODUCTION',
      hindsight: hindsightStatus,
      geminiAvailable: !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY',
      serverTime: new Date().toISOString()
    });
  });

  // Incidents
  app.get('/api/incidents', (req, res) => {
    const incidents = agentOrchestrator.getIncidents();
    res.json(incidents);
  });

  app.get('/api/incidents/:id', (req, res) => {
    const incident = agentOrchestrator.getIncident(req.params.id);
    if (!incident) return res.status(404).json({ error: 'Incident not found' });
    res.json(incident);
  });

  app.post('/api/incidents', (req, res) => {
    const newInc = agentOrchestrator.createIncident(req.body);
    res.status(201).json(newInc);
  });

  // AI Investigation (Analyze + Hindsight Recall + Reflect)
  app.post('/api/incidents/:id/investigate', async (req, res) => {
    try {
      const investigation = await agentOrchestrator.investigate(req.params.id);
      res.json(investigation);
    } catch (err: any) {
      console.error('[Investigate API Error]:', err);
      res.status(500).json({ error: err.message || 'Investigation failed' });
    }
  });

  // Resolve Incident
  app.post('/api/incidents/:id/resolve', (req, res) => {
    try {
      const { actionTaken, engineerNotes } = req.body;
      const resolved = agentOrchestrator.resolve(req.params.id, actionTaken, engineerNotes);
      res.json(resolved);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Resolve failed' });
    }
  });

  // Learn: Retain incident post-mortem to Hindsight
  app.post('/api/incidents/:id/learn', async (req, res) => {
    try {
      const learning = await agentOrchestrator.learn(req.params.id);
      res.json({
        success: true,
        message: 'New organizational memory created and retained in Hindsight.',
        learning
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Learning retention failed' });
    }
  });

  // Post-Mortem Generator
  app.post('/api/postmortem/generate', (req, res) => {
    try {
      const { incidentId } = req.body;
      const pm = agentOrchestrator.generatePostMortem(incidentId);
      res.json(pm);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Post-mortem generation failed' });
    }
  });

  // Memory Search (Hindsight Recall)
  app.get('/api/memory/search', async (req, res) => {
    try {
      const query = (req.query.q as string) || 'database connection failure';
      const service = req.query.service as string;
      const result = await hindsightService.recall(query, { service, limit: 10 });
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Memory search failed' });
    }
  });

  // Memory Stats & Explorer List
  app.get('/api/memory/stats', (req, res) => {
    const all = hindsightService.getAllMemories();
    const status = hindsightService.getStatus();
    res.json({
      totalMemories: 284, // Enterprise total knowledge count
      liveBankCount: all.length,
      incidentsIndexed: 76,
      rootCausesIdentified: 41,
      resolutionsCataloged: 93,
      recurringPatterns: 31,
      bankId: status.bankId,
      isLiveHindsight: !status.isFallback,
      status
    });
  });

  app.get('/api/memory/list', (req, res) => {
    const all = hindsightService.getAllMemories();
    res.json(all);
  });

  // Test Hindsight Connection
  app.post('/api/memory/test', async (req, res) => {
    const connected = await hindsightService.initBank();
    const status = hindsightService.getStatus();
    res.json({ success: connected, status });
  });

  // Runbooks & Learnings
  app.get('/api/runbooks', (req, res) => {
    res.json(INITIAL_RUNBOOKS);
  });

  app.get('/api/learnings', (req, res) => {
    const learnings = agentOrchestrator.getLearnings();
    res.json(learnings);
  });

  // Ask OpsMind Chat
  app.post('/api/chat', async (req, res) => {
    try {
      const { incidentId, question } = req.body;
      const answer = await agentOrchestrator.askOpsMind(incidentId || null, question || 'What happened?');
      res.json({ answer });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Chat query failed' });
    }
  });

  // Demo Reset
  app.post('/api/demo/reset', (req, res) => {
    agentOrchestrator.resetDemo();
    res.json({ success: true, message: 'Demo state reset to initial baseline' });
  });

  // ==========================================
  // VITE / STATIC SERVING
  // ==========================================
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[OpsMind] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
