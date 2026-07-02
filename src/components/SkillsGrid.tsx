import React, { useState } from 'react';
import { SKILL_GROUPS } from '../data';
import { Cpu, Gamepad2, Database, Layers, Radio, Workflow } from 'lucide-react';
import { motion } from 'motion/react';

interface SkillsGridProps {
  onSelectSkill: (skill: string) => void;
  selectedSkill: string | null;
  isJapaneseInkMode?: boolean;
}

interface SkillCategoryCardProps {
  key?: string | number;
  group: typeof SKILL_GROUPS[number];
  groupIdx: number;
  onSelectSkill: (skill: string) => void;
  selectedSkill: string | null;
  getCategoryIcon: (category: string) => React.ReactNode;
  getCategoryBorder: (category: string) => string;
  isJapaneseInkMode?: boolean;
}

function SkillCategoryCard({
  group,
  groupIdx,
  onSelectSkill,
  selectedSkill,
  getCategoryIcon,
  getCategoryBorder,
  isJapaneseInkMode = false
}: SkillCategoryCardProps) {
  const [mouseCoords, setMouseCoords] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMouseCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: groupIdx * 0.05, type: 'spring', stiffness: 50, damping: 15 }}
      onMouseMove={handleMouseMove}
      className={`relative overflow-hidden flex flex-col rounded-xl border p-5 transition-all duration-500 group ${
        isJapaneseInkMode
          ? 'border-stone-300/80 bg-[#f5f4f0]/65 backdrop-blur-md hover:bg-[#f5f4f0]/85 hover:border-red-600/40 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_8px_32px_rgba(41,37,36,0.05)]'
          : `border-white/[0.08] bg-slate-950/45 backdrop-blur-xl hover:bg-slate-950/55 hover:border-cyan-500/45 shadow-[inset_0_1px_2px_rgba(255,255,255,0.05),0_12px_40px_rgba(0,0,0,0.4)] ${getCategoryBorder(group.category)}`
      }`}
    >
      {/* Fluid interactive liquid spotlight glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"
        style={{
          background: isJapaneseInkMode
            ? `radial-gradient(300px circle at ${mouseCoords.x}px ${mouseCoords.y}px, rgba(220, 38, 38, 0.04), transparent 80%)`
            : `radial-gradient(300px circle at ${mouseCoords.x}px ${mouseCoords.y}px, rgba(34, 211, 238, 0.06), transparent 80%)`
        }}
      />

      {/* Group Header */}
      <div className={`flex items-center gap-2.5 mb-4 pb-3 border-b relative z-10 transition-colors duration-500 ${
        isJapaneseInkMode ? 'border-stone-250' : 'border-white/[0.04]'
      }`}>
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg shadow-sm transition-colors duration-500 ${
          isJapaneseInkMode ? 'bg-stone-200/60 border border-stone-300' : 'bg-slate-950/60 border border-white/[0.04] shadow-inner'
        }`}>
          {getCategoryIcon(group.category)}
        </div>
        <h3 className={`font-display text-sm font-bold uppercase tracking-wider transition-colors duration-500 ${
          isJapaneseInkMode ? 'text-stone-850' : 'text-slate-100'
        }`}>
          {group.category}
        </h3>
      </div>

      {/* Group Items */}
      <div className="flex flex-wrap gap-2 flex-1 content-start relative z-10">
        {group.items.map((skill) => {
          const isSelected = selectedSkill === skill;
          return (
            <motion.button
              key={skill}
              onClick={() => onSelectSkill(skill)}
              whileHover={{
                scale: 1.05,
                y: -1,
                rotate: isJapaneseInkMode ? [0, -0.6, 0.6, 0] : [0, -1.2, 1.2, -0.6, 0], // gentler wobble for ink paper
                transition: { duration: 0.45, ease: "easeInOut" }
              }}
              whileTap={{ scale: 0.96 }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-300 border cursor-pointer relative z-20 overflow-hidden group/btn ${
                isSelected
                  ? isJapaneseInkMode
                    ? 'bg-red-500/15 border-red-500 text-red-800 font-semibold shadow-[0_0_12px_rgba(220,38,38,0.12)]'
                    : 'bg-cyan-500/20 border-cyan-400 text-cyan-200 font-semibold shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                  : isJapaneseInkMode
                    ? 'bg-stone-50 border-stone-200 text-stone-700 hover:border-red-600/30 hover:text-red-700 hover:bg-stone-100/60'
                    : 'bg-slate-950/40 border-white/[0.04] text-slate-300 hover:border-cyan-500/30 hover:text-white hover:bg-slate-950/60'
              }`}
              id={`skill-btn-${skill.replace(/[^a-zA-Z0-9]/g, '-')}`}
            >
              {/* Glassy liquid reflection shine sweep */}
              <div className={`absolute inset-y-0 left-0 w-6 blur-xs -translate-x-12 group-hover/btn:animate-glass-shine pointer-events-none ${
                isJapaneseInkMode ? 'bg-red-500/5' : 'bg-white/10'
              }`} />
              <span className="relative z-10">{skill}</span>
            </motion.button>
          );
        })}
      </div>

      <div className={`mt-4 pt-3 border-t flex justify-between items-center relative z-10 transition-colors duration-500 ${
        isJapaneseInkMode ? 'border-stone-200' : 'border-white/[0.04]'
      }`}>
        <span className={`text-[10px] font-mono uppercase transition-colors duration-500 ${
          isJapaneseInkMode ? 'text-stone-500' : 'text-slate-500'
        }`}>
          {group.items.length} core assets
        </span>
        <span className={`text-[9px] font-mono transition-colors duration-500 pointer-events-none ${
          isJapaneseInkMode ? 'text-red-700/60 hover:text-red-700' : 'text-cyan-500/60 hover:text-cyan-400'
        }`}>
          click tags to filter projects
        </span>
      </div>
    </motion.div>
  );
}

export default function SkillsGrid({ onSelectSkill, selectedSkill, isJapaneseInkMode = false }: SkillsGridProps) {
  // Get icon based on category name
  const getCategoryIcon = (category: string) => {
    if (isJapaneseInkMode) {
      switch (category) {
        case 'Programming Languages':
          return <Cpu className="h-4.5 w-4.5 text-red-700" />;
        case 'Graphics & Game Dev':
          return <Gamepad2 className="h-4.5 w-4.5 text-red-700" />;
        case 'Databases':
          return <Database className="h-4.5 w-4.5 text-red-700" />;
        case 'Frameworks & Tools':
          return <Layers className="h-4.5 w-4.5 text-red-700" />;
        case 'Protocols & Integration':
          return <Radio className="h-4.5 w-4.5 text-red-700" />;
        default:
          return <Workflow className="h-4.5 w-4.5 text-red-700" />;
      }
    }

    switch (category) {
      case 'Programming Languages':
        return <Cpu className="h-4.5 w-4.5 text-cyan-400" />;
      case 'Graphics & Game Dev':
        return <Gamepad2 className="h-4.5 w-4.5 text-emerald-400" />;
      case 'Databases':
        return <Database className="h-4.5 w-4.5 text-indigo-400" />;
      case 'Frameworks & Tools':
        return <Layers className="h-4.5 w-4.5 text-amber-400" />;
      case 'Protocols & Integration':
        return <Radio className="h-4.5 w-4.5 text-rose-400" />;
      default:
        return <Workflow className="h-4.5 w-4.5 text-sky-400" />;
    }
  };

  // Get border style based on category
  const getCategoryBorder = (category: string) => {
    switch (category) {
      case 'Programming Languages':
        return 'hover:border-cyan-500/50 hover:shadow-cyan-500/5';
      case 'Graphics & Game Dev':
        return 'hover:border-emerald-500/50 hover:shadow-emerald-500/5';
      case 'Databases':
        return 'hover:border-indigo-500/50 hover:shadow-indigo-500/5';
      case 'Frameworks & Tools':
        return 'hover:border-amber-500/50 hover:shadow-amber-500/5';
      case 'Protocols & Integration':
        return 'hover:border-rose-500/50 hover:shadow-rose-500/5';
      default:
        return 'hover:border-sky-500/50 hover:shadow-sky-500/5';
    }
  };

  return (
    <div id="skills-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {SKILL_GROUPS.map((group, groupIdx) => (
        <SkillCategoryCard
          key={group.category}
          group={group}
          groupIdx={groupIdx}
          onSelectSkill={onSelectSkill}
          selectedSkill={selectedSkill}
          getCategoryIcon={getCategoryIcon}
          getCategoryBorder={getCategoryBorder}
          isJapaneseInkMode={isJapaneseInkMode}
        />
      ))}
    </div>
  );
}
