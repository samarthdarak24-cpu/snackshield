import React from 'react';
import { motion } from 'framer-motion';
import { Bot, RefreshCw, AlertTriangle, Lightbulb } from 'lucide-react';
import ScoreCircle from './ScoreCircle';

// ── helpers ──────────────────────────────────────────────────────────────────

const timeAgo = (iso) => {
  if (!iso) return 'Never';
  const diff = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const severityClass = {
  Critical: 'bg-red-100 text-red-700',
  High: 'bg-orange-100 text-orange-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  Low: 'bg-green-100 text-green-700',
};

const SeverityBadge = ({ severity }) => (
  <span
    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
      severityClass[severity] ?? 'bg-slate-100 text-slate-600'
    }`}
  >
    {severity}
  </span>
);

// ── gradient border per agent type ───────────────────────────────────────────

const gradientMap = {
  distributor: 'from-purple-500 via-purple-400 to-cyan-400',
  retailer: 'from-emerald-500 via-emerald-400 to-cyan-400',
};

// ── component ─────────────────────────────────────────────────────────────────

const AgentInsightCard = ({
  title = 'AI Agent',
  score = 0,
  scoreLabel = 'Score',
  scoreColor,          // optional override; auto-computed if omitted
  threats = [],
  recommendations = [],
  lastAnalyzed,
  totalAnalyzed,
  onReanalyze,
  loading = false,
  agentType = 'distributor',
}) => {
  const gradient = gradientMap[agentType] ?? gradientMap.distributor;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="relative bg-white rounded-2xl shadow-md overflow-hidden"
    >
      {/* Gradient top border */}
      <div className={`h-1 w-full bg-gradient-to-r ${gradient}`} />

      <div className="p-5">
        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-sm`}
            >
              <Bot size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
              {totalAnalyzed !== undefined && (
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {totalAnalyzed} items analyzed
                </p>
              )}
            </div>
          </div>

          {/* Active badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-semibold text-emerald-700">Active</span>
          </div>
        </div>

        {/* ── Score circle ── */}
        <div className="flex justify-center mb-5">
          <ScoreCircle score={score} size={120} strokeWidth={10} label={scoreLabel} />
        </div>

        {/* ── Threats ── */}
        {threats.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-1.5 mb-2">
              <AlertTriangle size={13} className="text-amber-500" />
              <span className="text-xs font-semibold text-slate-700">
                Threats Detected
              </span>
              <span className="ml-auto text-[10px] font-medium bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">
                {threats.length}
              </span>
            </div>
            <ul className="space-y-2">
              {threats.map((t, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-slate-700 leading-snug">{t.message}</p>
                    {(t.productId || t.count !== undefined) && (
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {t.productId && `ID: ${t.productId}`}
                        {t.productId && t.count !== undefined && ' · '}
                        {t.count !== undefined && `×${t.count}`}
                      </p>
                    )}
                  </div>
                  <SeverityBadge severity={t.severity} />
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ── Recommendations ── */}
        {recommendations.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-1.5 mb-2">
              <Lightbulb size={13} className="text-yellow-500" />
              <span className="text-xs font-semibold text-slate-700">Recommendations</span>
            </div>
            <ul className="space-y-2">
              {recommendations.map((r, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100"
                >
                  <Lightbulb size={12} className="text-yellow-400 mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-slate-700 leading-snug">{r.message}</p>
                    {r.count !== undefined && (
                      <p className="text-[10px] text-slate-400 mt-0.5">×{r.count}</p>
                    )}
                  </div>
                  {r.severity && <SeverityBadge severity={r.severity} />}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ── Footer ── */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <span className="text-[11px] text-slate-400">
            Last analyzed: {timeAgo(lastAnalyzed)}
          </span>
          <button
            onClick={onReanalyze}
            disabled={loading}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all
              ${
                loading
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : `bg-gradient-to-r ${gradient} text-white hover:opacity-90 shadow-sm`
              }`}
          >
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
            {loading ? 'Analyzing…' : 'Re-analyze'}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AgentInsightCard;
