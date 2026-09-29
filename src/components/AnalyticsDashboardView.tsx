import React, { useState, useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  BarChart3, 
  TrendingDown, 
  Sparkles, 
  Filter, 
  ShieldCheck
} from 'lucide-react';

export type SeverityFilter = 'Critical' | 'Warning' | 'Info';

interface DailyIncidentData {
  date: string;
  day: string;
  critical: number;
  warning: number;
  info: number;
  criticalMttr: number;
  warningMttr: number;
  infoMttr: number;
  memoryAssisted: boolean;
}

interface ServiceMetric {
  name: string;
  critical: number;
  warning: number;
  info: number;
  color: string;
}

interface PatternMetric {
  category: string;
  severity: SeverityFilter;
  count: number;
  avgResolution: string;
  mttrDelta: string;
}

// 30 Days of realistic production telemetry showing the learning impact across severities
const LAST_30_DAYS_DATA: DailyIncidentData[] = [
  { date: 'Aug 31', day: 'D-30', critical: 1, warning: 2, info: 1, criticalMttr: 28.5, warningMttr: 22.0, infoMttr: 14.0, memoryAssisted: false },
  { date: 'Sep 01', day: 'D-29', critical: 0, warning: 1, info: 2, criticalMttr: 0, warningMttr: 19.0, infoMttr: 12.0, memoryAssisted: false },
  { date: 'Sep 02', day: 'D-28', critical: 1, warning: 1, info: 1, criticalMttr: 25.0, warningMttr: 20.0, infoMttr: 11.5, memoryAssisted: false },
  { date: 'Sep 03', day: 'D-27', critical: 0, warning: 2, info: 2, criticalMttr: 0, warningMttr: 18.5, infoMttr: 13.0, memoryAssisted: false },
  { date: 'Sep 04', day: 'D-26', critical: 0, warning: 0, info: 1, criticalMttr: 0, warningMttr: 0, infoMttr: 10.0, memoryAssisted: false },
  { date: 'Sep 05', day: 'D-25', critical: 1, warning: 2, info: 2, criticalMttr: 29.0, warningMttr: 24.0, infoMttr: 12.5, memoryAssisted: false },
  { date: 'Sep 06', day: 'D-24', critical: 0, warning: 1, info: 1, criticalMttr: 0, warningMttr: 17.0, infoMttr: 11.0, memoryAssisted: false },
  { date: 'Sep 07', day: 'D-23', critical: 0, warning: 1, info: 2, criticalMttr: 0, warningMttr: 16.5, infoMttr: 10.5, memoryAssisted: false },
  { date: 'Sep 08', day: 'D-22', critical: 1, warning: 0, info: 1, criticalMttr: 24.0, warningMttr: 0, infoMttr: 9.5, memoryAssisted: false },
  { date: 'Sep 09', day: 'D-21', critical: 0, warning: 2, info: 1, criticalMttr: 0, warningMttr: 19.5, infoMttr: 11.0, memoryAssisted: false },
  { date: 'Sep 10', day: 'D-20', critical: 1, warning: 1, info: 2, criticalMttr: 22.0, warningMttr: 18.0, infoMttr: 10.0, memoryAssisted: false },
  { date: 'Sep 11', day: 'D-19', critical: 0, warning: 0, info: 1, criticalMttr: 0, warningMttr: 0, infoMttr: 9.0, memoryAssisted: false },
  { date: 'Sep 12', day: 'D-18', critical: 1, warning: 1, info: 1, criticalMttr: 18.0, warningMttr: 14.0, infoMttr: 8.5, memoryAssisted: true },
  { date: 'Sep 13', day: 'D-17', critical: 0, warning: 1, info: 2, criticalMttr: 0, warningMttr: 13.5, infoMttr: 8.0, memoryAssisted: true },
  { date: 'Sep 14', day: 'D-16', critical: 1, warning: 0, info: 1, criticalMttr: 15.0, warningMttr: 0, infoMttr: 7.5, memoryAssisted: true },
  { date: 'Sep 15', day: 'D-15', critical: 0, warning: 2, info: 1, criticalMttr: 0, warningMttr: 13.0, infoMttr: 7.0, memoryAssisted: true },
  { date: 'Sep 16', day: 'D-14', critical: 0, warning: 1, info: 2, criticalMttr: 0, warningMttr: 11.5, infoMttr: 6.5, memoryAssisted: true },
  { date: 'Sep 17', day: 'D-13', critical: 1, warning: 1, info: 1, criticalMttr: 13.5, warningMttr: 11.0, infoMttr: 6.0, memoryAssisted: true },
  { date: 'Sep 18', day: 'D-12', critical: 0, warning: 0, info: 1, criticalMttr: 0, warningMttr: 0, infoMttr: 5.5, memoryAssisted: true },
  { date: 'Sep 19', day: 'D-11', critical: 0, warning: 1, info: 0, criticalMttr: 0, warningMttr: 10.0, infoMttr: 0, memoryAssisted: true },
  { date: 'Sep 20', day: 'D-10', critical: 1, warning: 1, info: 1, criticalMttr: 11.0, warningMttr: 9.5, infoMttr: 5.0, memoryAssisted: true },
  { date: 'Sep 21', day: 'D-09', critical: 0, warning: 1, info: 2, criticalMttr: 0, warningMttr: 9.0, infoMttr: 5.0, memoryAssisted: true },
  { date: 'Sep 22', day: 'D-08', critical: 0, warning: 0, info: 1, criticalMttr: 0, warningMttr: 0, infoMttr: 4.5, memoryAssisted: true },
  { date: 'Sep 23', day: 'D-07', critical: 1, warning: 1, info: 0, criticalMttr: 9.0, warningMttr: 8.5, infoMttr: 0, memoryAssisted: true },
  { date: 'Sep 24', day: 'D-06', critical: 0, warning: 1, info: 1, criticalMttr: 0, warningMttr: 8.0, infoMttr: 4.0, memoryAssisted: true },
  { date: 'Sep 25', day: 'D-05', critical: 0, warning: 0, info: 2, criticalMttr: 0, warningMttr: 0, infoMttr: 4.0, memoryAssisted: true },
  { date: 'Sep 26', day: 'D-04', critical: 0, warning: 1, info: 1, criticalMttr: 0, warningMttr: 7.5, infoMttr: 3.5, memoryAssisted: true },
  { date: 'Sep 27', day: 'D-03', critical: 1, warning: 0, info: 1, criticalMttr: 8.5, warningMttr: 0, infoMttr: 3.5, memoryAssisted: true },
  { date: 'Sep 28', day: 'D-02', critical: 0, warning: 1, info: 0, criticalMttr: 0, warningMttr: 7.0, infoMttr: 0, memoryAssisted: true },
  { date: 'Sep 29', day: 'Today', critical: 1, warning: 0, info: 1, criticalMttr: 8.2, warningMttr: 0, infoMttr: 3.0, memoryAssisted: true },
];

const SERVICE_DISTRIBUTION: ServiceMetric[] = [
  { name: 'Payments API', critical: 4, warning: 5, info: 3, color: '#DA1E28' },
  { name: 'Auth Gateway', critical: 2, warning: 4, info: 6, color: '#FF832B' },
  { name: 'Order Processing', critical: 3, warning: 3, info: 4, color: '#F1C21B' },
  { name: 'Cart Cache', critical: 1, warning: 6, info: 8, color: '#4589FF' },
  { name: 'Inventory DB', critical: 2, warning: 3, info: 5, color: '#24A148' },
];

const PATTERN_CATEGORIES: PatternMetric[] = [
  { category: 'Connection Pool Saturation', severity: 'Critical', count: 7, avgResolution: '8.4m', mttrDelta: '-68%' },
  { category: 'Canary Latency Divergence', severity: 'Critical', count: 5, avgResolution: '7.1m', mttrDelta: '-62%' },
  { category: 'Redis Memory Eviction Spike', severity: 'Warning', count: 9, avgResolution: '11.2m', mttrDelta: '-45%' },
  { category: 'Third-Party Webhook Timeout', severity: 'Warning', count: 6, avgResolution: '14.0m', mttrDelta: '-38%' },
  { category: 'Kafka Lag Heartbeat Degradation', severity: 'Info', count: 12, avgResolution: '4.8m', mttrDelta: '-72%' },
  { category: 'DNS Resolution Latency Blip', severity: 'Info', count: 8, avgResolution: '3.5m', mttrDelta: '-80%' },
];

export const AnalyticsDashboardView: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'30' | '14' | '7'>('30');
  const [selectedSeverities, setSelectedSeverities] = useState<SeverityFilter[]>([
    'Critical',
    'Warning',
    'Info'
  ]);

  const toggleSeverity = (sev: SeverityFilter) => {
    setSelectedSeverities(prev => {
      if (prev.includes(sev)) {
        if (prev.length === 1) return prev; // Keep at least one
        return prev.filter(s => s !== sev);
      } else {
        return [...prev, sev];
      }
    });
  };

  const selectAllSeverities = () => {
    setSelectedSeverities(['Critical', 'Warning', 'Info']);
  };

  const isAllSelected = selectedSeverities.length === 3;
  const isCriticalActive = selectedSeverities.includes('Critical');
  const isWarningActive = selectedSeverities.includes('Warning');
  const isInfoActive = selectedSeverities.includes('Info');

  const timeFilteredData = useMemo(() => {
    const days = parseInt(timeRange);
    return LAST_30_DAYS_DATA.slice(-days);
  }, [timeRange]);

  const processedData = useMemo(() => {
    return timeFilteredData.map(day => {
      let total = 0;
      let mttrSum = 0;
      let mttrCount = 0;

      if (isCriticalActive) {
        total += day.critical;
        if (day.criticalMttr > 0) {
          mttrSum += day.criticalMttr * day.critical;
          mttrCount += day.critical;
        }
      }

      if (isWarningActive) {
        total += day.warning;
        if (day.warningMttr > 0) {
          mttrSum += day.warningMttr * day.warning;
          mttrCount += day.warning;
        }
      }

      if (isInfoActive) {
        total += day.info;
        if (day.infoMttr > 0) {
          mttrSum += day.infoMttr * day.info;
          mttrCount += day.info;
        }
      }

      const calculatedMttr = mttrCount > 0 ? parseFloat((mttrSum / mttrCount).toFixed(1)) : 0;

      return {
        date: day.date,
        day: day.day,
        critical: isCriticalActive ? day.critical : 0,
        warning: isWarningActive ? day.warning : 0,
        info: isInfoActive ? day.info : 0,
        total,
        avgResolutionMinutes: calculatedMttr,
        memoryAssisted: day.memoryAssisted
      };
    });
  }, [timeFilteredData, isCriticalActive, isWarningActive, isInfoActive]);

  const totalIncidents = useMemo(() => {
    return processedData.reduce((acc, curr) => acc + curr.total, 0);
  }, [processedData]);

  const criticalCount = useMemo(() => {
    return processedData.reduce((acc, curr) => acc + curr.critical, 0);
  }, [processedData]);

  const warningCount = useMemo(() => {
    return processedData.reduce((acc, curr) => acc + curr.warning, 0);
  }, [processedData]);

  const infoCount = useMemo(() => {
    return processedData.reduce((acc, curr) => acc + curr.info, 0);
  }, [processedData]);

  const activeDaysWithData = useMemo(() => {
    return processedData.filter(d => d.total > 0 && d.avgResolutionMinutes > 0);
  }, [processedData]);

  const currentMttr = useMemo(() => {
    if (activeDaysWithData.length === 0) return '0.0m';
    const sum = activeDaysWithData.reduce((acc, curr) => acc + curr.avgResolutionMinutes, 0);
    return `${(sum / activeDaysWithData.length).toFixed(1)}m`;
  }, [activeDaysWithData]);

  const filteredServiceData = useMemo(() => {
    return SERVICE_DISTRIBUTION.map(s => {
      let count = 0;
      if (isCriticalActive) count += s.critical;
      if (isWarningActive) count += s.warning;
      if (isInfoActive) count += s.info;
      return {
        name: s.name,
        incidents: count,
        color: s.color
      };
    });
  }, [isCriticalActive, isWarningActive, isInfoActive]);

  const filteredPatterns = useMemo(() => {
    return PATTERN_CATEGORIES.filter(p => selectedSeverities.includes(p.severity));
  }, [selectedSeverities]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-5 animate-carbon-reveal">
      {/* 1. Page Header (Carbon Standard) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#393939]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-[#F4F4F4] tracking-tight">
              Incident Analytics & Pattern Detection
            </h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-xs bg-[#262626] text-[#C6C6C6] border border-[#393939]">
              METRICS
            </span>
          </div>
          <p className="text-xs text-[#C6C6C6] mt-0.5">
            Frequency, resolution velocity (MTTR), and recurring operational patterns across telemetry.
          </p>
        </div>

        {/* Time Window Selector (Carbon Standard) */}
        <div className="flex items-center bg-[#262626] p-0.5 rounded-xs border border-[#393939] text-xs font-mono self-start sm:self-center">
          {(['30', '14', '7'] as const).map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 transition-colors ${
                timeRange === range
                  ? 'bg-[#393939] text-[#F4F4F4] font-semibold border-b-2 border-[#0F62FE]'
                  : 'text-[#8D8D8D] hover:text-[#C6C6C6]'
              }`}
            >
              {range}D
            </button>
          ))}
        </div>
      </div>

      {/* 2. SEVERITY LEVEL FILTER CONTROLS (Carbon Standard) */}
      <div className="carbon-panel p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-mono text-[#C6C6C6]">
          <Filter className="w-3.5 h-3.5 text-[#8D8D8D]" />
          <span className="font-semibold text-[#F4F4F4]">Severity Filter:</span>
          <span className="text-[11px] text-[#8D8D8D] hidden md:inline">Isolate active telemetry layers</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          {/* ALL Button */}
          <button
            onClick={selectAllSeverities}
            className={`px-3 py-1 rounded-xs border transition-colors ${
              isAllSelected
                ? 'bg-[#393939] text-[#F4F4F4] border-[#525252] font-semibold'
                : 'bg-[#262626] text-[#8D8D8D] border-[#393939] hover:bg-[#333333] hover:text-[#C6C6C6]'
            }`}
          >
            <span>All Severities</span>
          </button>

          {/* CRITICAL Button */}
          <button
            onClick={() => toggleSeverity('Critical')}
            className={`px-3 py-1 rounded-xs border transition-colors flex items-center gap-2 ${
              isCriticalActive
                ? 'bg-[#DA1E28]/15 text-[#FA4D56] border-[#DA1E28]/40 font-medium'
                : 'bg-[#262626] text-[#6F6F6F] border-[#393939] opacity-60 hover:opacity-100'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isCriticalActive ? 'bg-[#DA1E28]' : 'bg-[#525252]'}`} />
            <span>Critical</span>
            <span className="text-[10px] px-1 py-0.2 rounded-xs bg-[#161616] border border-[#DA1E28]/30 font-bold">
              {criticalCount}
            </span>
          </button>

          {/* WARNING Button */}
          <button
            onClick={() => toggleSeverity('Warning')}
            className={`px-3 py-1 rounded-xs border transition-colors flex items-center gap-2 ${
              isWarningActive
                ? 'bg-[#F1C21B]/15 text-[#F1C21B] border-[#F1C21B]/40 font-medium'
                : 'bg-[#262626] text-[#6F6F6F] border-[#393939] opacity-60 hover:opacity-100'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isWarningActive ? 'bg-[#F1C21B]' : 'bg-[#525252]'}`} />
            <span>Warning</span>
            <span className="text-[10px] px-1 py-0.2 rounded-xs bg-[#161616] border border-[#F1C21B]/30 font-bold">
              {warningCount}
            </span>
          </button>

          {/* INFO Button */}
          <button
            onClick={() => toggleSeverity('Info')}
            className={`px-3 py-1 rounded-xs border transition-colors flex items-center gap-2 ${
              isInfoActive
                ? 'bg-[#0F62FE]/15 text-[#78A9FF] border-[#0F62FE]/40 font-medium'
                : 'bg-[#262626] text-[#6F6F6F] border-[#393939] opacity-60 hover:opacity-100'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isInfoActive ? 'bg-[#0F62FE]' : 'bg-[#525252]'}`} />
            <span>Info</span>
            <span className="text-[10px] px-1 py-0.2 rounded-xs bg-[#161616] border border-[#0F62FE]/30 font-bold">
              {infoCount}
            </span>
          </button>
        </div>
      </div>

      {/* 3. Section 12 Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="carbon-panel p-3.5 space-y-1">
          <div className="text-[10px] font-mono text-[#8D8D8D] uppercase tracking-wider">
            Filtered Incidents ({timeRange}D)
          </div>
          <div className="text-2xl font-bold font-mono text-[#F4F4F4]">{totalIncidents}</div>
          <div className="text-[11px] text-[#8D8D8D] font-mono">
            {selectedSeverities.join(', ')}
          </div>
        </div>

        <div className="carbon-panel p-3.5 space-y-1">
          <div className="text-[10px] font-mono text-[#8D8D8D] uppercase tracking-wider">Filtered MTTR</div>
          <div className="text-2xl font-bold font-mono text-[#24A148]">{currentMttr}</div>
          <div className="text-[11px] text-[#24A148] font-mono flex items-center gap-1">
            <TrendingDown className="w-3 h-3" />
            <span>Down from 24.5m baseline</span>
          </div>
        </div>

        <div className="carbon-panel p-3.5 space-y-1">
          <div className="text-[10px] font-mono text-[#8D8D8D] uppercase tracking-wider">Hindsight Efficiency</div>
          <div className="text-2xl font-bold font-mono text-[#4589FF]">-64%</div>
          <div className="text-[11px] text-[#8D8D8D] font-mono">Faster triage on recurring leaks</div>
        </div>

        <div className="carbon-panel p-3.5 space-y-1">
          <div className="text-[10px] font-mono text-[#8D8D8D] uppercase tracking-wider">Pattern Avoidance</div>
          <div className="text-2xl font-bold font-mono text-[#F4F4F4]">100%</div>
          <div className="text-[11px] text-[#8D8D8D] font-mono">Zero replica-scaling mistakes</div>
        </div>
      </div>

      {/* 4. CHART 1: Incident Frequency Over Time */}
      <div className="carbon-panel p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#393939] pb-2">
          <div>
            <h2 className="text-xs font-bold font-mono uppercase tracking-wider text-[#F4F4F4]">
              Incident Frequency Over Time (Last {timeRange} Days)
            </h2>
            <p className="text-[11px] text-[#8D8D8D]">
              Layered breakdown by severity: {selectedSeverities.join(', ')}.
            </p>
          </div>
          <div className="flex items-center gap-3 text-[10px] font-mono">
            {isCriticalActive && (
              <span className="flex items-center gap-1.5 text-[#FA4D56]">
                <span className="w-2 h-2 rounded-xs bg-[#DA1E28]" />
                <span>Critical</span>
              </span>
            )}
            {isWarningActive && (
              <span className="flex items-center gap-1.5 text-[#F1C21B]">
                <span className="w-2 h-2 rounded-xs bg-[#F1C21B]" />
                <span>Warning</span>
              </span>
            )}
            {isInfoActive && (
              <span className="flex items-center gap-1.5 text-[#78A9FF]">
                <span className="w-2 h-2 rounded-xs bg-[#0F62FE]" />
                <span>Info</span>
              </span>
            )}
          </div>
        </div>

        <div className="h-56 w-full pt-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={processedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke="#525252" 
                fontSize={10} 
                tickLine={false}
                axisLine={{ stroke: '#393939' }}
              />
              <YAxis 
                stroke="#525252" 
                fontSize={10} 
                allowDecimals={false}
                tickLine={false}
                axisLine={{ stroke: '#393939' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#262626', 
                  borderColor: '#525252', 
                  borderRadius: '2px',
                  fontSize: '11px',
                  fontFamily: 'IBM Plex Mono, monospace',
                  color: '#F4F4F4'
                }}
                itemStyle={{ color: '#F4F4F4' }}
                cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }}
              />
              {isCriticalActive && (
                <Bar dataKey="critical" name="Critical" fill="#DA1E28" radius={[1, 1, 0, 0]} stackId="a" />
              )}
              {isWarningActive && (
                <Bar dataKey="warning" name="Warning" fill="#F1C21B" radius={[1, 1, 0, 0]} stackId="a" />
              )}
              {isInfoActive && (
                <Bar dataKey="info" name="Info" fill="#0F62FE" radius={[1, 1, 0, 0]} stackId="a" />
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 5. CHART 2: MTTR Resolution Time Velocity Trend */}
      <div className="carbon-panel p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#393939] pb-2">
          <div>
            <h2 className="text-xs font-bold font-mono uppercase tracking-wider text-[#F4F4F4]">
              Mean Time to Resolution (MTTR in Minutes)
            </h2>
            <p className="text-[11px] text-[#8D8D8D]">
              Downward inflection demonstrating operational learning from Hindsight retention.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#24A148] bg-[#24A148]/10 border border-[#24A148]/30 px-2 py-0.5 rounded-xs">
            <Sparkles className="w-3 h-3 text-[#24A148]" />
            <span>Impact: 24.5m → 8.2m (-66%)</span>
          </div>
        </div>

        <div className="h-56 w-full pt-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart 
              data={processedData.filter(d => d.avgResolutionMinutes > 0)} 
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="mttrGradientCarbon" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4589FF" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#4589FF" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke="#525252" 
                fontSize={10} 
                tickLine={false}
                axisLine={{ stroke: '#393939' }}
              />
              <YAxis 
                stroke="#525252" 
                fontSize={10} 
                tickLine={false}
                axisLine={{ stroke: '#393939' }}
                unit="m"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#262626', 
                  borderColor: '#525252', 
                  borderRadius: '2px',
                  fontSize: '11px',
                  fontFamily: 'IBM Plex Mono, monospace',
                  color: '#F4F4F4'
                }}
                formatter={(val: any) => [`${val} minutes`, 'MTTR']}
                cursor={{ stroke: '#4589FF', strokeWidth: 1 }}
              />
              <Area 
                type="monotone" 
                dataKey="avgResolutionMinutes" 
                stroke="#4589FF" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#mttrGradientCarbon)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 6. 2-Column: Service Distribution + Systemic Patterns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Service Breakdown */}
        <div className="carbon-panel p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-[#393939] pb-2">
            <h2 className="text-xs font-bold font-mono uppercase tracking-wider text-[#F4F4F4]">
              Incidents by Microservice ({selectedSeverities.join(', ')})
            </h2>
            <span className="text-[10px] font-mono text-[#8D8D8D]">
              Total: {filteredServiceData.reduce((acc, c) => acc + c.incidents, 0)}
            </span>
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredServiceData} layout="vertical" margin={{ top: 0, right: 20, left: 40, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" horizontal={false} />
                <XAxis type="number" stroke="#525252" fontSize={10} tickLine={false} />
                <YAxis dataKey="name" type="category" stroke="#8D8D8D" fontSize={10} tickLine={false} width={100} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#262626', 
                    borderColor: '#525252', 
                    borderRadius: '2px',
                    fontSize: '11px',
                    fontFamily: 'IBM Plex Mono, monospace',
                    color: '#F4F4F4'
                  }}
                  formatter={(val: any) => [`${val} incidents`, 'Count']}
                />
                <Bar dataKey="incidents" fill="#0F62FE" radius={[0, 2, 2, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pattern Spotting Insights */}
        <div className="carbon-panel p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-[#393939] pb-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#4589FF]" />
              <h2 className="text-xs font-bold font-mono uppercase tracking-wider text-[#F4F4F4]">
                Detected Patterns ({filteredPatterns.length})
              </h2>
            </div>
            <span className="text-[10px] font-mono text-[#42be65] bg-[#24a148]/10 border border-[#24a148]/30 px-2 py-0.5 rounded-xs">
              Hindsight Indexed
            </span>
          </div>

          <div className="space-y-2">
            {filteredPatterns.length > 0 ? (
              filteredPatterns.map((pat, idx) => (
                <div 
                  key={idx}
                  className="p-2.5 rounded-xs bg-[#1e1e1e] border border-[#393939] flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded-xs font-medium border ${
                        pat.severity === 'Critical'
                          ? 'bg-[#DA1E28]/15 text-[#FA4D56] border-[#DA1E28]/40'
                          : pat.severity === 'Warning'
                          ? 'bg-[#F1C21B]/15 text-[#F1C21B] border-[#F1C21B]/40'
                          : 'bg-[#0F62FE]/15 text-[#78A9FF] border-[#0F62FE]/40'
                      }`}>
                        {pat.severity}
                      </span>
                      <span className="font-semibold text-[#F4F4F4]">{pat.category}</span>
                    </div>
                    <div className="text-[10px] font-mono text-[#8D8D8D]">
                      {pat.count} occurrences • Avg MTTR: {pat.avgResolution}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-mono font-medium text-[#42be65] bg-[#24a148]/10 border border-[#24a148]/30 px-2 py-0.5 rounded-xs">
                      {pat.mttrDelta}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-xs text-[#8D8D8D] font-mono">
                No patterns matching current severity filter
              </div>
            )}
          </div>

          <div className="p-2 rounded-xs bg-[#161616] border border-[#393939] text-[11px] text-[#C6C6C6] font-mono flex items-center gap-2">
            <span className="text-[#4589FF]">✦</span>
            <span>Pattern Correlation: Connection exhaustion is systematically linked with Tuesday canary releases.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
