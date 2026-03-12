'use client';

import React, { useState } from 'react';

interface ButtonPanelProps {
  onButton: (value: string) => void;
  isRadians: boolean;
}

type ButtonConfig = {
  label: string;
  value: string;
  type: 'number' | 'operator' | 'scientific' | 'memory' | 'equals' | 'clear' | 'special';
  span?: number;
  className?: string;
};

export default function ButtonPanel({ onButton, isRadians }: ButtonPanelProps) {
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  const handleClick = (value: string) => {
    setPressedKey(value);
    setTimeout(() => setPressedKey(null), 150);
    onButton(value);
  };

  const memoryButtons: ButtonConfig[] = [
    { label: 'MC', value: 'MC', type: 'memory' },
    { label: 'MR', value: 'MR', type: 'memory' },
    { label: 'M+', value: 'M+', type: 'memory' },
    { label: 'M-', value: 'M-', type: 'memory' },
  ];

  const scientificRow1: ButtonConfig[] = [
    { label: 'sin', value: 'sin(', type: 'scientific' },
    { label: 'cos', value: 'cos(', type: 'scientific' },
    { label: 'tan', value: 'tan(', type: 'scientific' },
    { label: 'π', value: 'π', type: 'scientific' },
  ];

  const scientificRow2: ButtonConfig[] = [
    { label: 'asin', value: 'asin(', type: 'scientific' },
    { label: 'acos', value: 'acos(', type: 'scientific' },
    { label: 'atan', value: 'atan(', type: 'scientific' },
    { label: 'e', value: 'e', type: 'scientific' },
  ];

  const scientificRow3: ButtonConfig[] = [
    { label: 'log', value: 'log(', type: 'scientific' },
    { label: 'ln', value: 'ln(', type: 'scientific' },
    { label: 'x²', value: '²', type: 'scientific' },
    { label: 'x³', value: '³', type: 'scientific' },
  ];

  const scientificRow4: ButtonConfig[] = [
    { label: '√', value: '√(', type: 'scientific' },
    { label: '∛', value: '∛(', type: 'scientific' },
    { label: 'xⁿ', value: '^', type: 'scientific' },
    { label: 'n!', value: '!', type: 'scientific' },
  ];

  const mainButtons: ButtonConfig[] = [
    { label: 'AC', value: 'AC', type: 'clear' },
    { label: '+/-', value: '+/-', type: 'special' },
    { label: '%', value: '%', type: 'special' },
    { label: '÷', value: '÷', type: 'operator' },

    { label: '7', value: '7', type: 'number' },
    { label: '8', value: '8', type: 'number' },
    { label: '9', value: '9', type: 'number' },
    { label: '×', value: '×', type: 'operator' },

    { label: '4', value: '4', type: 'number' },
    { label: '5', value: '5', type: 'number' },
    { label: '6', value: '6', type: 'number' },
    { label: '-', value: '-', type: 'operator' },

    { label: '1', value: '1', type: 'number' },
    { label: '2', value: '2', type: 'number' },
    { label: '3', value: '3', type: 'number' },
    { label: '+', value: '+', type: 'operator' },

    { label: '(', value: '(', type: 'special' },
    { label: '0', value: '0', type: 'number' },
    { label: '.', value: '.', type: 'number' },
    { label: '⌫', value: '⌫', type: 'clear' },

    { label: ')', value: ')', type: 'special', span: 2 },
    { label: '=', value: '=', type: 'equals', span: 2 },
  ];

  const getButtonStyle = (type: ButtonConfig['type'], value: string, isPressed: boolean) => {
    const base = {
      transition: 'all 0.15s ease',
      transform: isPressed ? 'scale(0.92)' : 'scale(1)',
      cursor: 'pointer',
      border: 'none',
      borderRadius: '12px',
      fontWeight: '600' as const,
      fontSize: '15px',
      letterSpacing: '0.02em',
    };

    switch (type) {
      case 'equals':
        return {
          ...base,
          background: isPressed
            ? 'linear-gradient(135deg, #c73652, #b02d47)'
            : 'linear-gradient(135deg, #e94560, #c73652)',
          color: '#ffffff',
          boxShadow: isPressed ? 'none' : '0 4px 15px rgba(233,69,96,0.4)',
        };
      case 'operator':
        return {
          ...base,
          background: isPressed
            ? 'rgba(233,69,96,0.4)'
            : 'rgba(233,69,96,0.2)',
          color: '#e94560',
          border: '1px solid rgba(233,69,96,0.3)',
        };
      case 'scientific':
        return {
          ...base,
          background: isPressed
            ? 'rgba(83,52,131,0.6)'
            : 'rgba(83,52,131,0.3)',
          color: '#a78bfa',
          border: '1px solid rgba(83,52,131,0.4)',
          fontSize: '13px',
        };
      case 'memory':
        return {
          ...base,
          background: isPressed
            ? 'rgba(15,52,96,0.8)'
            : 'rgba(15,52,96,0.5)',
          color: '#60a5fa',
          border: '1px solid rgba(15,52,96,0.6)',
          fontSize: '13px',
        };
      case 'clear':
        return {
          ...base,
          background: isPressed
            ? 'rgba(234,179,8,0.4)'
            : 'rgba(234,179,8,0.2)',
          color: '#fbbf24',
          border: '1px solid rgba(234,179,8,0.3)',
        };
      case 'special':
        return {
          ...base,
          background: isPressed
            ? 'rgba(255,255,255,0.15)'
            : 'rgba(255,255,255,0.08)',
          color: 'rgba(255,255,255,0.8)',
          border: '1px solid rgba(255,255,255,0.1)',
        };
      case 'number':
      default:
        return {
          ...base,
          background: isPressed
            ? 'rgba(255,255,255,0.18)'
            : 'rgba(255,255,255,0.06)',
          color: '#ffffff',
          border: '1px solid rgba(255,255,255,0.08)',
        };
    }
  };

  const renderButton = (btn: ButtonConfig, idx: number) => {
    const isPressed = pressedKey === btn.value;
    const style = getButtonStyle(btn.type, btn.value, isPressed);
    return (
      <button
        key={`${btn.value}-${idx}`}
        onClick={() => handleClick(btn.value)}
        style={{
          ...style,
          gridColumn: btn.span ? `span ${btn.span}` : 'span 1',
          height: '52px',
          minWidth: 0,
        }}
        className="select-none"
        title={btn.label}
      >
        {btn.label}
      </button>
    );
  };

  return (
    <div className="p-4 space-y-2">
      {/* Memory row */}
      <div className="grid grid-cols-4 gap-2">
        {memoryButtons.map((btn, i) => renderButton(btn, i))}
      </div>

      {/* Scientific rows */}
      <div className="grid grid-cols-4 gap-2">
        {scientificRow1.map((btn, i) => renderButton(btn, i))}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {scientificRow2.map((btn, i) => renderButton(btn, i))}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {scientificRow3.map((btn, i) => renderButton(btn, i))}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {scientificRow4.map((btn, i) => renderButton(btn, i))}
      </div>

      {/* Divider */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', margin: '4px 0' }} />

      {/* Main calculator buttons */}
      <div className="grid grid-cols-4 gap-2">
        {mainButtons.map((btn, i) => renderButton(btn, i))}
      </div>
    </div>
  );
}
