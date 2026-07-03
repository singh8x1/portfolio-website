import React, { useState } from 'react';
import { Project } from '../types';
import { ChevronRight, Gamepad2, MapPin, Calendar, Code2, Globe } from 'lucide-react';
import { motion } from 'motion/react';

interface ProjectCardProps {
  project: Project;
  index: number;
  key?: string;
  isJapaneseInkMode?: boolean;
}

export default function ProjectCard({ project, index, isJapaneseInkMode = false }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mouseCoords, setMouseCoords] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMouseCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // Map key icons based on tech tags
  const getProjectIcon = () => {
    const title = project.title.toLowerCase();
    const iconClass = isJapaneseInkMode ? 'h-5 w-5 text-red-700' : 'h-5 w-5 text-cyan-400';
    
    if (title.includes('game') || title.includes('td')) {
      return <Gamepad2 className={iconClass} />;
    }
    if (title.includes('gps') || title.includes('keychain')) {
      const globClass = isJapaneseInkMode ? 'h-5 w-5 text-red-700' : 'h-5 w-5 text-emerald-400';
      return <Globe className={globClass} />;
    }
    const codeClass = isJapaneseInkMode ? 'h-5 w-5 text-red-700' : 'h-5 w-5 text-indigo-400';
    return <Code2 className={codeClass} />;
  };

  return (
    <motion.div
      id={`project-card-${project.id}`}
      initial={{ opacity: 0, y: 25, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ type: 'spring', stiffness: 50, damping: 15, delay: Math.min(index * 0.05, 0.3) }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      className={`relative overflow-hidden flex flex-col h-full rounded-xl border p-5 transition-all duration-500 group ${
        isJapaneseInkMode
          ? 'border-stone-300/80 bg-[#f5f4f0]/65 backdrop-blur-md hover:bg-[#f5f4f0]/85 hover:border-red-600/40 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_8px_32px_rgba(41,37,36,0.05)]'
          : 'border-white/[0.08] bg-slate-950/45 backdrop-blur-xl hover:border-cyan-500/45 hover:bg-slate-950/55 hover:shadow-[0_20px_50px_rgba(6,182,212,0.08)] shadow-[inset_0_1px_2px_rgba(255,255,255,0.05),0_12px_40px_rgba(0,0,0,0.4)]'
      }`}
    >
      {/* Fluid interactive liquid spotlight glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"
        style={{
          background: isJapaneseInkMode
            ? `radial-gradient(320px circle at ${mouseCoords.x}px ${mouseCoords.y}px, rgba(220, 38, 38, 0.04), transparent 85%)`
            : `radial-gradient(320px circle at ${mouseCoords.x}px ${mouseCoords.y}px, rgba(6, 182, 212, 0.065), transparent 85%)`
        }}
      />
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-lg shadow-inner transition-all duration-500 ${
            isJapaneseInkMode
              ? 'bg-stone-200 border border-stone-350 group-hover:border-red-600/40'
              : 'bg-slate-950/60 border border-white/[0.04] group-hover:border-cyan-500/30'
          }`}>
            {getProjectIcon()}
          </div>
          <div>
            <h3 className={`font-display text-base font-bold transition-colors ${
              isJapaneseInkMode
                ? 'text-stone-900 group-hover:text-red-700'
                : 'text-slate-100 group-hover:text-cyan-400'
            }`}>
              {project.title}
            </h3>
            <p className={`text-xs mt-0.5 ${isJapaneseInkMode ? 'text-stone-550' : 'text-slate-400'}`}>{project.institution}</p>
          </div>
        </div>
        <span className={`flex items-center gap-1 text-[10px] font-mono font-medium uppercase tracking-widest px-2 py-0.5 rounded border ${
          isJapaneseInkMode
            ? 'text-stone-600 bg-stone-200/60 border-stone-300'
            : 'text-slate-500 bg-slate-950/60 border border-white/[0.04]'
        }`}>
          <Calendar className="h-3 w-3 text-stone-500" /> {project.period}
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {project.technologies.map((tech) => (
          <span
            key={tech}
            className={`rounded px-2 py-0.5 text-[10px] font-mono border transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 cursor-default relative overflow-hidden group/tag ${
              isJapaneseInkMode
                ? 'bg-stone-200/50 text-stone-750 border-stone-300 hover:border-red-600/40 hover:text-red-700'
                : 'bg-slate-950/50 text-slate-400 border border-white/[0.04] hover:border-cyan-500/30 hover:text-cyan-300'
            }`}
          >
            {/* Tiny glassy swipe across the tag on hover */}
            <div className={`absolute inset-y-0 left-0 w-3 blur-xs -translate-x-6 group-hover/tag:animate-glass-shine pointer-events-none ${
              isJapaneseInkMode ? 'bg-red-500/5' : 'bg-white/10'
            }`} />
            <span className="relative z-10">{tech}</span>
          </span>
        ))}
      </div>

      <ul className={`flex-1 space-y-2.5 text-sm ${isJapaneseInkMode ? 'text-stone-750' : 'text-slate-300'}`}>
        {project.description.map((bullet, idx) => (
          <li key={idx} className="flex items-start gap-2 leading-relaxed">
            <ChevronRight className={`h-4 w-4 mt-1 flex-shrink-0 ${isJapaneseInkMode ? 'text-red-700/80' : 'text-cyan-500/80'}`} />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>

      <div className={`mt-5 pt-4 border-t flex items-center justify-between text-xs font-mono ${
        isJapaneseInkMode ? 'border-stone-200 text-stone-600' : 'border-white/[0.04] text-slate-400'
      }`}>
        <span className="flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5 text-stone-500" /> {project.location}
        </span>
        <span className={`text-[10px] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 tracking-wider ${
          isJapaneseInkMode ? 'text-red-700' : 'text-cyan-400/80'
        }`}>
          active project &bull; live view
        </span>
      </div>
    </motion.div>
  );
}
