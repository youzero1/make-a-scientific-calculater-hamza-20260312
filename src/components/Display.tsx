'use client';

import React from 'react';

interface DisplayProps {
  expression: string;
  display: string;
  result: string;
}

export default function Display({ expression, display, result }: DisplayProps) {
  const getFontSize = (text: string) => {
    if (text.length > 20) return 'text-lg';
    if (text.length > 14) return 'text-2xl';
    if (text.length > 10) return 'text-3xl';
    return 'text-4xl';
  };

  return (
    <div
      className="px-6 py-4 min-h-[140px] flex flex-col justify-between"
      style={{
        background: 'rgba(10, 20, 40, 0.6)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      {/* Expression line */}
      <div className="min-h-[28px] flex items-center justify-end">
        <span
          className="text-sm font-mono text-right break-all"
          style={{ color: 'rgba(255,255,255,0.5)' }}
        >
          {expression || ''}
        </span>
      </div>

      {/* Main display */}
      <div className="flex items-end justify-end gap-3 mt-2">
        <div className="flex-1 flex flex-col items-end">
          <span
            className={`font-mono font-bold text-right break-all transition-all duration-150 ${getFontSize(display)}`}
            style={{ color: '#ffffff' }}
          >
            {display || '0'}
          </span>
        </div>
      </div>

      {/* Result preview */}
      <div className="min-h-[24px] flex items-center justify-end mt-1">
        {result && result !== display && (
          <span
            className="text-xl font-mono font-semibold"
            style={{ color: '#e94560' }}
          >
            = {result}
          </span>
        )}
      </div>
    </div>
  );
}
