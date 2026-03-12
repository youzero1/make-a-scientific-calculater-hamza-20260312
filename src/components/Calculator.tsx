'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Display from './Display';
import ButtonPanel from './ButtonPanel';
import HistoryPanel from './HistoryPanel';
import { evaluateExpression } from '@/lib/calculator';

export interface HistoryEntry {
  id: number;
  expression: string;
  result: string;
  createdAt: string;
}

export default function Calculator() {
  const [expression, setExpression] = useState('');
  const [display, setDisplay] = useState('0');
  const [result, setResult] = useState('');
  const [memory, setMemory] = useState(0);
  const [isRadians, setIsRadians] = useState(true);
  const [justEvaluated, setJustEvaluated] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const fetchHistory = useCallback(async () => {
    setLoadingHistory(true);
    try {
      const res = await fetch('/api/history');
      const data = await res.json();
      if (data.history) setHistory(data.history);
    } catch (e) {
      console.error('Failed to fetch history', e);
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  useEffect(() => {
    if (showHistory) fetchHistory();
  }, [showHistory, fetchHistory]);

  const saveToHistory = useCallback(async (expr: string, res: string) => {
    try {
      await fetch('/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expression: expr, result: res }),
      });
      if (showHistory) fetchHistory();
    } catch (e) {
      console.error('Failed to save history', e);
    }
  }, [showHistory, fetchHistory]);

  const clearHistory = useCallback(async () => {
    try {
      await fetch('/api/history', { method: 'DELETE' });
      setHistory([]);
    } catch (e) {
      console.error('Failed to clear history', e);
    }
  }, []);

  const handleButton = useCallback((value: string) => {
    switch (value) {
      case 'AC':
      case 'C': {
        setExpression('');
        setDisplay('0');
        setResult('');
        setJustEvaluated(false);
        break;
      }
      case '⌫': {
        if (justEvaluated) {
          setExpression('');
          setDisplay('0');
          setResult('');
          setJustEvaluated(false);
          break;
        }
        const newExpr = expression.slice(0, -1);
        setExpression(newExpr);
        setDisplay(newExpr || '0');
        if (newExpr) {
          const r = evaluateExpression(newExpr, isRadians);
          if (r !== 'Error') setResult(r);
          else setResult('');
        } else {
          setResult('');
        }
        break;
      }
      case '=': {
        if (!expression) break;
        const evalResult = evaluateExpression(expression, isRadians);
        setResult(evalResult);
        if (evalResult !== 'Error') {
          saveToHistory(expression, evalResult);
          setDisplay(evalResult);
          setExpression(evalResult);
          setJustEvaluated(true);
        } else {
          setDisplay('Error');
        }
        break;
      }
      case 'MC': {
        setMemory(0);
        break;
      }
      case 'MR': {
        const memStr = memory.toString();
        if (justEvaluated) {
          setExpression(memStr);
          setDisplay(memStr);
          setResult('');
          setJustEvaluated(false);
        } else {
          const newExpr = expression + memStr;
          setExpression(newExpr);
          setDisplay(newExpr);
          const r = evaluateExpression(newExpr, isRadians);
          if (r !== 'Error') setResult(r);
        }
        break;
      }
      case 'M+': {
        const currentResult = result || evaluateExpression(expression, isRadians);
        const num = parseFloat(currentResult);
        if (!isNaN(num)) setMemory(prev => prev + num);
        break;
      }
      case 'M-': {
        const currentResult2 = result || evaluateExpression(expression, isRadians);
        const num2 = parseFloat(currentResult2);
        if (!isNaN(num2)) setMemory(prev => prev - num2);
        break;
      }
      case 'RAD':
      case 'DEG': {
        setIsRadians(prev => !prev);
        break;
      }
      case '%': {
        if (!expression) break;
        const pctExpr = `(${expression})/100`;
        const pctResult = evaluateExpression(pctExpr, isRadians);
        setExpression(pctResult !== 'Error' ? pctResult : expression);
        setDisplay(pctResult !== 'Error' ? pctResult : expression);
        setResult('');
        break;
      }
      case '+/-': {
        if (!expression) break;
        if (expression.startsWith('-')) {
          const pos = expression.slice(1);
          setExpression(pos);
          setDisplay(pos || '0');
        } else {
          const neg = '-' + expression;
          setExpression(neg);
          setDisplay(neg);
        }
        break;
      }
      default: {
        // All other buttons append to expression
        let toAppend = value;
        let newExpr: string;

        if (justEvaluated) {
          // If it's an operator, continue from result
          const operators = ['+', '-', '×', '÷', '^', '%'];
          if (operators.includes(value)) {
            newExpr = expression + value;
          } else {
            // Start fresh
            newExpr = toAppend;
          }
          setJustEvaluated(false);
        } else {
          newExpr = expression + toAppend;
        }

        setExpression(newExpr);
        setDisplay(newExpr);

        // Live result preview
        const r = evaluateExpression(newExpr, isRadians);
        if (r !== 'Error') setResult(r);
        else setResult('');
        break;
      }
    }
  }, [expression, result, memory, isRadians, justEvaluated, saveToHistory]);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      if (key >= '0' && key <= '9') handleButton(key);
      else if (key === '+') handleButton('+');
      else if (key === '-') handleButton('-');
      else if (key === '*') handleButton('×');
      else if (key === '/') { e.preventDefault(); handleButton('÷'); }
      else if (key === '.') handleButton('.');
      else if (key === 'Enter' || key === '=') handleButton('=');
      else if (key === 'Backspace') handleButton('⌫');
      else if (key === 'Escape') handleButton('AC');
      else if (key === '(') handleButton('(');
      else if (key === ')') handleButton(')');
      else if (key === '^') handleButton('^');
      else if (key === '%') handleButton('%');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleButton]);

  return (
    <div className="flex flex-col lg:flex-row gap-4 w-full max-w-5xl">
      <div className="flex-1">
        <div
          className="rounded-2xl overflow-hidden shadow-2xl"
          style={{
            background: 'rgba(22, 33, 62, 0.95)',
            border: '1px solid rgba(233, 69, 96, 0.2)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <h1 className="text-white font-bold text-lg tracking-wide">
              🧮 Scientific Calculator
            </h1>
            <div className="flex items-center gap-2">
              {memory !== 0 && (
                <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full">
                  M: {memory}
                </span>
              )}
              <button
                onClick={() => setIsRadians(prev => !prev)}
                className="text-xs px-3 py-1 rounded-full font-semibold transition-all duration-200"
                style={{
                  background: isRadians ? 'rgba(233, 69, 96, 0.3)' : 'rgba(83, 52, 131, 0.3)',
                  border: `1px solid ${isRadians ? 'rgba(233, 69, 96, 0.5)' : 'rgba(83, 52, 131, 0.5)'}`,
                  color: isRadians ? '#e94560' : '#a78bfa',
                }}
              >
                {isRadians ? 'RAD' : 'DEG'}
              </button>
              <button
                onClick={() => setShowHistory(prev => !prev)}
                className="text-xs px-3 py-1 rounded-full font-semibold transition-all duration-200"
                style={{
                  background: showHistory ? 'rgba(233, 69, 96, 0.3)' : 'rgba(255,255,255,0.1)',
                  border: `1px solid ${showHistory ? 'rgba(233, 69, 96, 0.5)' : 'rgba(255,255,255,0.1)'}`,
                  color: showHistory ? '#e94560' : 'rgba(255,255,255,0.7)',
                }}
              >
                History
              </button>
            </div>
          </div>

          <Display
            expression={expression}
            display={display}
            result={result}
          />

          <ButtonPanel
            onButton={handleButton}
            isRadians={isRadians}
          />
        </div>
      </div>

      {showHistory && (
        <div className="lg:w-80 w-full">
          <HistoryPanel
            history={history}
            loading={loadingHistory}
            onClear={clearHistory}
            onRefresh={fetchHistory}
            onSelect={(entry) => {
              setExpression(entry.result);
              setDisplay(entry.result);
              setResult('');
              setJustEvaluated(false);
            }}
          />
        </div>
      )}
    </div>
  );
}
