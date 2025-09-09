import React, { useEffect, useMemo, useRef, useState } from 'react';
import './calculator.css';

/**
 * PUBLIC_INTERFACE
 * Calculator renders a responsive calculator with basic arithmetic operations,
 * live expression/result display, buttons input, and keyboard input support.
 *
 * Features:
 * - Addition, Subtraction, Multiplication, Division
 * - Clear Entry (C), All Clear/Reset (AC), Delete (⌫)
 * - Display current operation (expression) and result
 * - Keyboard input for digits, operators, Enter (=), Backspace, Escape
 */
export default function Calculator() {
  // Internal state for expression and result
  const [expression, setExpression] = useState('0');
  const [result, setResult] = useState('0');
  const [justEvaluated, setJustEvaluated] = useState(false);
  const displayRef = useRef(null);

  // Map keyboard keys to operations
  const keyMap = useMemo(
    () => ({
      Enter: '=',
      '=': '=',
      '+': '+',
      '-': '-',
      '*': '×',
      x: '×',
      X: '×',
      '/': '÷',
      '.': '.',
      ',': '.',
      Backspace: 'DEL',
      Delete: 'C',
      Escape: 'AC',
    }),
    []
  );

  // Evaluate a safe arithmetic expression
  const safeEval = (expr) => {
    // Replace display operators with JS operators
    const normalized = expr.replace(/×/g, '*').replace(/÷/g, '/');
    // Prevent invalid trailing operators
    if (/[\+\-\*\/.]$/.test(normalized)) {
      return normalized.slice(0, -1);
    }
    try {
      // eslint-disable-next-line no-new-func
      const val = Function(`"use strict";return (${normalized})`)();
      if (typeof val === 'number' && isFinite(val)) {
        return String(val);
      }
      return 'Error';
    } catch {
      return 'Error';
    }
  };

  // Update result whenever expression changes
  useEffect(() => {
    if (!expression) {
      setResult('0');
      return;
    }
    const res = safeEval(expression);
    setResult(res === 'Error' ? 'Error' : String(res));
  }, [expression]);

  // Focus handling for better keyboard UX
  useEffect(() => {
    displayRef.current?.focus();
  }, []);

  // Helpers
  const isOperator = (c) => ['+', '-', '×', '÷'].includes(c);

  const appendDigit = (d) => {
    setExpression((prev) => {
      if (justEvaluated) {
        setJustEvaluated(false);
        return d; // start new expression after evaluation when digit pressed
      }
      if (prev === '0') return d; // replace leading zero
      return prev + d;
    });
  };

  const appendDot = () => {
    setExpression((prev) => {
      // Prevent multiple dots in the current segment
      const segments = prev.split(/[\+\-×÷]/);
      const last = segments[segments.length - 1];
      if (last.includes('.')) return prev;
      if (justEvaluated) {
        setJustEvaluated(false);
        return '0.';
      }
      return prev + (last === '' ? '0.' : '.');
    });
  };

  const appendOperator = (op) => {
    setExpression((prev) => {
      let cur = prev;
      if (justEvaluated) {
        // Continue chaining with result after evaluation
        setJustEvaluated(false);
        cur = result === 'Error' ? '0' : result;
      }
      // If empty, allow negative sign to start
      if (cur === '' && op === '-') return '-';
      if (cur === '' && op !== '-') return '0' + op;

      // Replace trailing operator if exists (avoid double operators)
      if (isOperator(cur.slice(-1))) {
        return cur.slice(0, -1) + op;
      }
      return cur + op;
    });
  };

  const clearEntry = () => {
    // Clear the current number segment
    setExpression((prev) => {
      const parts = prev.split(/([\+\-×÷])/); // keep separators
      if (parts.length === 1) return '0';
      if (isOperator(parts[parts.length - 1])) {
        // last is operator, clear segment before it
        parts.splice(parts.length - 2, 1, '0');
      } else {
        // last is number; clear it
        parts[parts.length - 1] = '0';
      }
      const joined = parts.join('');
      // normalize consecutive operators edge cases
      return joined.replace(/^0([\+\-×÷].*)$/, '0$1');
    });
  };

  const allClear = () => {
    setExpression('0');
    setResult('0');
    setJustEvaluated(false);
  };

  const del = () => {
    setExpression((prev) => {
      if (justEvaluated) {
        setJustEvaluated(false);
        return '0';
      }
      if (prev.length <= 1) return '0';
      const next = prev.slice(0, -1);
      return next === '' ? '0' : next;
    });
  };

  const equals = () => {
    setExpression((prev) => {
      const res = safeEval(prev);
      setJustEvaluated(true);
      return res === 'Error' ? '0' : String(res);
    });
  };

  // Keyboard support
  useEffect(() => {
    const onKeyDown = (e) => {
      const { key } = e;
      if (/\d/.test(key)) {
        e.preventDefault();
        appendDigit(key);
        return;
      }
      if (key === '.' || key === ',') {
        e.preventDefault();
        appendDot();
        return;
      }
      const mapped = keyMap[key];
      if (!mapped && !['+', '-', '*', '/'].includes(key)) return;

      e.preventDefault();
      const op = mapped || (key === '*' ? '×' : key === '/' ? '÷' : key);
      if (op === '=') return equals();
      if (op === 'DEL') return del();
      if (op === 'C') return clearEntry();
      if (op === 'AC') return allClear();
      if (['+', '-', '×', '÷'].includes(op)) return appendOperator(op);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [keyMap, result, justEvaluated]);

  // Button click handler
  const onButton = (value) => {
    if (/^\d$/.test(value)) return appendDigit(value);
    if (value === '.') return appendDot();
    if (['+', '-', '×', '÷'].includes(value)) return appendOperator(value);
    if (value === '=') return equals();
    if (value === 'AC') return allClear();
    if (value === 'C') return clearEntry();
    if (value === 'DEL') return del();
  };

  return (
    <div className="calculator" role="application" aria-label="Calculator">
      <div
        className="display"
        tabIndex={0}
        ref={displayRef}
        aria-live="polite"
        aria-label={`Expression ${expression}, result ${result}`}
      >
        <div className="expression" title={expression}>{expression}</div>
        <div className="result" title={result}>= {result}</div>
      </div>

      <div className="keypad">
        <div className="row">
          <CalcButton label="AC" variant="accent" onClick={onButton} />
          <CalcButton label="C" variant="accent" onClick={onButton} />
          <CalcButton label="DEL" variant="accent" onClick={onButton} />
          <CalcButton label="÷" variant="operator" onClick={onButton} />
        </div>
        <div className="row">
          <CalcButton label="7" onClick={onButton} />
          <CalcButton label="8" onClick={onButton} />
          <CalcButton label="9" onClick={onButton} />
          <CalcButton label="×" variant="operator" onClick={onButton} />
        </div>
        <div className="row">
          <CalcButton label="4" onClick={onButton} />
          <CalcButton label="5" onClick={onButton} />
          <CalcButton label="6" onClick={onButton} />
          <CalcButton label="-" variant="operator" onClick={onButton} />
        </div>
        <div className="row">
          <CalcButton label="1" onClick={onButton} />
          <CalcButton label="2" onClick={onButton} />
          <CalcButton label="3" onClick={onButton} />
          <CalcButton label="+" variant="operator" onClick={onButton} />
        </div>
        <div className="row">
          <CalcButton label="0" grow onClick={onButton} />
          <CalcButton label="." onClick={onButton} />
          <CalcButton label="=" variant="primary" onClick={onButton} />
        </div>
      </div>
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * CalcButton is a presentational button for the calculator keypad.
 * Props:
 * - label: string shown on the button and passed back in onClick(label)
 * - variant: 'primary' | 'operator' | 'accent' | undefined
 * - grow: boolean to make the button span two columns (used for 0 key)
 * - onClick: (label: string) => void
 */
export function CalcButton({ label, onClick, variant, grow = false }) {
  return (
    <button
      className={`btn ${variant ? `btn-${variant}` : ''} ${grow ? 'btn-grow' : ''}`}
      onClick={() => onClick(label)}
      aria-label={`key ${label}`}
    >
      {label}
    </button>
  );
}
