'use client';

import React from 'react';
import { HistoryEntry } from './Calculator';

interface HistoryPanelProps {
  history: HistoryEntry[];
  loading: boolean;
  onClear: () => void;
  onRefresh: () => void;
  onSelect: (entry: HistoryEntry) => void;
}

export default function HistoryPanel({
  history,
  loading,
  onClear,
  onRefresh,
  onSelect,
}: HistoryPanelProps) {
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div
      className="rounded-2xl overflow-hidden shadow-2xl h-full flex flex-col"
      style={{
        background: 'rgba(22, 33, 62, 0.95)',
        border: '1px solid rgba(233, 69, 96, 0.2)',
        backdropFilter: 'blur(20px)',
        minHeight: '400px',
        maxHeight: '700px',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
      >
        <h2 className="text-white font-bold text-base">History</h2>
        <div className="flex gap-2">
          <button
            onClick={onRefresh}
            className="text-xs px-2 py-1 rounded-lg transition-all"
            style={{
              background: 'rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.6)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
            title="Refresh"
          >
            ↻
          </button>
          <button
            onClick={onClear}
            className="text-xs px-2 py-1 rounded-lg transition-all"
            style={{
              background: 'rgba(233,69,96,0.15)',
              color: '#e94560',
              border: '1px solid rgba(233,69,96,0.3)',
            }}
            title="Clear History"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div
              className="animate-spin rounded-full h-8 w-8"
              style={{ border: '2px solid rgba(233,69,96,0.3)', borderTopColor: '#e94560' }}
            />
          </div>
        ) : history.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center h-full gap-3"
            style={{ color: 'rgba(255,255,255,0.3)' }}
          >
            <span className="text-3xl">📜</span>
            <span className="text-sm">No calculations yet</span>
          </div>
        ) : (
          history.map((entry) => (
            <button
              key={entry.id}
              onClick={() => onSelect(entry)}
              className="w-full text-left rounded-xl p-3 transition-all history-item"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(233,69,96,0.1)';
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(233,69,96,0.3)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)';
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.08)';
              }}
            >
              <div
                className="text-xs mb-1 truncate"
                style={{ color: 'rgba(255,255,255,0.4)' }}
              >
                {entry.expression}
              </div>
              <div className="flex items-center justify-between">
                <span
                  className="text-base font-semibold font-mono"
                  style={{ color: '#e94560' }}
                >
                  = {entry.result}
                </span>
                <span
                  className="text-xs"
                  style={{ color: 'rgba(255,255,255,0.25)' }}
                >
                  {formatDate(entry.createdAt)}
                </span>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
