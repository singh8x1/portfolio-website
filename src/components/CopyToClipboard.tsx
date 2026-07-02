import { useState } from 'react';
import { Check, Copy, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CopyToClipboardProps {
  text: string;
  label?: string;
  className?: string;
}

export default function CopyToClipboard({ text, label, className = "" }: CopyToClipboardProps) {
  const [state, setState] = useState<'idle' | 'copied' | 'error'>('idle');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setState('copied');
      setTimeout(() => {
        setState('idle');
      }, 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
      setState('error');
      setTimeout(() => {
        setState('idle');
      }, 3000);
    }
  };

  const ariaLabel =
    state === 'idle'
      ? `Copy ${label || 'text'} to clipboard`
      : state === 'copied'
      ? 'Copied successfully'
      : 'Failed to copy';

  return (
    <button
      onClick={handleCopy}
      className={`group relative inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-300 transition-all duration-200 hover:border-slate-500 hover:bg-slate-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 ${className}`}
      aria-label={ariaLabel}
      aria-live="polite"
      id={`copy-btn-${text.replace(/[^a-zA-Z0-9]/g, '-')}`}
    >
      <span className="truncate max-w-[160px] md:max-w-xs">{text}</span>
      <span className="flex items-center justify-center w-4 h-4 text-slate-400 group-hover:text-cyan-400">
        <AnimatePresence mode="wait" initial={false}>
          {state === 'idle' && (
            <motion.span
              key="copy"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
            >
              <Copy className="h-3.5 w-3.5" />
            </motion.span>
          )}
          {state === 'copied' && (
            <motion.span
              key="check"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              className="text-emerald-400"
            >
              <Check className="h-3.5 w-3.5" />
            </motion.span>
          )}
          {state === 'error' && (
            <motion.span
              key="error"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              className="text-rose-400"
            >
              <AlertCircle className="h-3.5 w-3.5" />
            </motion.span>
          )}
        </AnimatePresence>
      </span>

      {/* Floating tooltip/badge indicator */}
      <AnimatePresence>
        {state === 'copied' && (
          <motion.span
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-emerald-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-950 shadow-md"
          >
            Copied!
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
