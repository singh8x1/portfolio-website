import React, { useState } from 'react';
import { EXPERIENCE_LIST, EDUCATION_LIST } from '../data';
import { Briefcase, GraduationCap, MapPin, Calendar, Plus, Minus, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function TimelineSection({ isJapaneseInkMode = false }: { isJapaneseInkMode?: boolean }) {
  const [expandedExperience, setExpandedExperience] = useState<string | null>('exp-1');
  const [expandedEducation, setExpandedEducation] = useState<string | null>('edu-1');

  const toggleExperience = (id: string) => {
    setExpandedExperience(expandedExperience === id ? null : id);
  };

  const toggleEducation = (id: string) => {
    setExpandedEducation(expandedEducation === id ? null : id);
  };

  return (
    <div id="timeline-section" className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Work Experience Timeline - 7 cols */}
      <div className="lg:col-span-7 flex flex-col h-full">
        <div className="flex items-center gap-2 mb-6">
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg shadow-inner transition-colors duration-500 ${
            isJapaneseInkMode ? 'bg-red-500/10 border border-red-500/20' : 'bg-cyan-950/60 border border-cyan-800/60'
          }`}>
            <Briefcase className={`h-4.5 w-4.5 transition-colors duration-500 ${isJapaneseInkMode ? 'text-red-700' : 'text-cyan-400'}`} />
          </div>
          <h2 className={`font-display text-xl font-extrabold tracking-tight transition-colors duration-500 ${
            isJapaneseInkMode ? 'text-stone-900' : 'text-slate-100'
          }`}>
            Professional Experience
          </h2>
        </div>

        <div className={`relative pl-6 border-l space-y-6 flex-1 transition-colors duration-500 ${
          isJapaneseInkMode ? 'border-stone-300' : 'border-slate-800/60'
        }`}>
          {EXPERIENCE_LIST.map((exp, index) => {
            const isExpanded = expandedExperience === exp.id;
            return (
              <div key={exp.id} className="relative group">
                {/* Timeline node */}
                <span className={`absolute -left-[31px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full border transition-all duration-500 ${
                  isJapaneseInkMode 
                    ? 'border-stone-300 bg-stone-100 group-hover:border-red-600' 
                    : 'border-slate-800 bg-slate-950 group-hover:border-cyan-400/80'
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full transition-colors ${
                    isExpanded 
                      ? (isJapaneseInkMode ? 'bg-red-700' : 'bg-cyan-400 animate-pulse') 
                      : (isJapaneseInkMode ? 'bg-stone-400' : 'bg-slate-600')
                  }`} />
                </span>

                <div className={`rounded-xl border p-5 transition-all duration-500 ${
                  isJapaneseInkMode 
                    ? 'border-stone-300 bg-stone-100/50 hover:border-red-600/30 hover:bg-stone-50/75 shadow-[0_2px_12px_rgba(0,0,0,0.015)]' 
                    : 'border-white/[0.04] bg-slate-950/20 backdrop-blur-md hover:border-cyan-500/25 hover:bg-slate-950/35 shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)]'
                }`}>
                  <div
                    onClick={() => toggleExperience(exp.id)}
                    className="flex items-start justify-between gap-4 cursor-pointer"
                  >
                    <div>
                      <h3 className={`font-display text-base font-bold transition-colors ${
                        isJapaneseInkMode 
                          ? 'text-stone-900 group-hover:text-red-700' 
                          : 'text-slate-100 group-hover:text-cyan-400'
                      }`}>
                        {exp.role}
                      </h3>
                      <p className={`text-sm font-medium mt-1 ${isJapaneseInkMode ? 'text-stone-600' : 'text-slate-400'}`}>{exp.company}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`flex items-center gap-1 text-[10px] font-mono font-medium uppercase tracking-widest px-2 py-0.5 rounded border ${
                        isJapaneseInkMode
                          ? 'text-stone-600 bg-stone-200/60 border-stone-300'
                          : 'text-slate-500 bg-slate-950/60 border border-white/[0.04]'
                      }`}>
                        <Calendar className="h-3 w-3" /> {exp.period}
                      </span>
                      <button className={`flex h-6 w-6 items-center justify-center rounded transition-all ${
                        isJapaneseInkMode 
                          ? 'bg-stone-200 text-stone-600 hover:text-red-700 border border-stone-300 hover:border-red-600/40' 
                          : 'bg-slate-950/60 text-slate-400 hover:text-white border border-white/[0.02] hover:border-cyan-500/30'
                      }`}>
                        {isExpanded ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-2 text-xs text-slate-500 font-mono">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {exp.location}
                    </span>
                    <span>&bull;</span>
                    <span className={isJapaneseInkMode ? 'text-red-700/80' : 'text-cyan-500/80'}>Full-time</span>
                  </div>

                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0, marginTop: 0 }}
                        animate={{ height: 'auto', opacity: 1, marginTop: 16 }}
                        exit={{ height: 0, opacity: 0, marginTop: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className={`pt-3 border-t space-y-3 ${isJapaneseInkMode ? 'border-stone-200' : 'border-white/[0.04]'}`}>
                           {exp.achievements.map((achievement, idx) => (
                            <div key={idx} className={`flex items-start gap-2.5 text-sm leading-relaxed ${isJapaneseInkMode ? 'text-stone-750' : 'text-slate-300'}`}>
                              <span className={`mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0 ${isJapaneseInkMode ? 'bg-red-700/80' : 'bg-cyan-400/80'}`} />
                              <span>{achievement}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Education Timeline - 5 cols */}
      <div className="lg:col-span-5 flex flex-col h-full">
        <div className="flex items-center gap-2 mb-6">
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg shadow-inner transition-colors duration-500 ${
            isJapaneseInkMode ? 'bg-red-500/10 border border-red-500/20' : 'bg-emerald-950/60 border border-emerald-800/60'
          }`}>
            <GraduationCap className={`h-4.5 w-4.5 transition-colors duration-500 ${isJapaneseInkMode ? 'text-red-700' : 'text-emerald-400'}`} />
          </div>
          <h2 className={`font-display text-xl font-extrabold tracking-tight transition-colors duration-500 ${
            isJapaneseInkMode ? 'text-stone-900' : 'text-slate-100'
          }`}>
            Academic Background
          </h2>
        </div>

        <div className={`relative pl-6 border-l space-y-6 flex-1 transition-colors duration-500 ${
          isJapaneseInkMode ? 'border-stone-300' : 'border-slate-800/60'
        }`}>
          {EDUCATION_LIST.map((edu, index) => {
            const isExpanded = expandedEducation === edu.id;
            return (
              <div key={edu.id} className="relative group">
                {/* Timeline node */}
                <span className={`absolute -left-[31px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full border transition-colors duration-500 ${
                  isJapaneseInkMode 
                    ? 'border-stone-300 bg-stone-100 group-hover:border-red-600' 
                    : 'border-slate-800 bg-slate-950 group-hover:border-emerald-500'
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full transition-colors ${
                    isExpanded 
                      ? (isJapaneseInkMode ? 'bg-red-750' : 'bg-emerald-400 animate-pulse') 
                      : (isJapaneseInkMode ? 'bg-stone-400' : 'bg-slate-600')
                  }`} />
                </span>

                <div className={`rounded-xl border p-5 transition-all duration-500 ${
                  isJapaneseInkMode 
                    ? 'border-stone-300 bg-stone-100/50 hover:border-red-600/30 hover:bg-stone-50/75 shadow-[0_2px_12px_rgba(0,0,0,0.015)]' 
                    : 'border-white/[0.04] bg-slate-950/20 backdrop-blur-md hover:border-emerald-500/25 hover:bg-slate-950/35 shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)]'
                }`}>
                  <div
                    onClick={() => toggleEducation(edu.id)}
                    className="flex items-start justify-between gap-4 cursor-pointer"
                  >
                    <div>
                      <h3 className={`font-display text-sm font-bold transition-colors leading-snug ${
                        isJapaneseInkMode 
                          ? 'text-stone-900 group-hover:text-red-700' 
                          : 'text-slate-100 group-hover:text-emerald-400'
                      }`}>
                        {edu.degree}
                      </h3>
                      <p className={`text-xs mt-1 ${isJapaneseInkMode ? 'text-stone-600' : 'text-slate-400'}`}>{edu.institution}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-mono font-medium uppercase tracking-widest px-2 py-0.5 rounded border whitespace-nowrap ${
                        isJapaneseInkMode
                          ? 'text-stone-600 bg-stone-200/60 border-stone-300'
                          : 'text-slate-500 bg-slate-950/60 border border-white/[0.04]'
                      }`}>
                        {edu.period}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 text-xs text-slate-500 font-mono">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {edu.location}
                    </span>
                    <button
                      onClick={() => toggleEducation(edu.id)}
                      className={`text-[10px] font-medium flex items-center gap-1 transition-colors cursor-pointer ${
                        isJapaneseInkMode ? 'text-red-700 hover:text-red-600' : 'text-emerald-400/80 hover:text-emerald-300'
                      }`}
                    >
                      <FileText className="h-3 w-3" /> Details
                    </button>
                  </div>

                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0, marginTop: 0 }}
                        animate={{ height: 'auto', opacity: 1, marginTop: 12 }}
                        exit={{ height: 0, opacity: 0, marginTop: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className={`pt-3 border-t text-xs leading-relaxed space-y-2 font-mono transition-colors duration-500 ${
                          isJapaneseInkMode ? 'border-stone-200 text-stone-750' : 'border-white/[0.04] text-slate-300'
                        }`}>
                          {edu.id === 'edu-1' ? (
                            <>
                              <div className={isJapaneseInkMode ? 'text-stone-550' : 'text-slate-400'}>Core Focus Area:</div>
                              <div className={isJapaneseInkMode ? 'text-red-700/90' : 'text-emerald-300/90'}>&bull; Advanced Web Application Architectures</div>
                              <div className={isJapaneseInkMode ? 'text-red-700/90' : 'text-emerald-300/90'}>&bull; Large-scale Data Analytics & PySpark Systems</div>
                              <div className={isJapaneseInkMode ? 'text-red-700/90' : 'text-emerald-300/90'}>&bull; Graphics Engines, Game Theory & 3D Assets</div>
                            </>
                          ) : (
                            <>
                              <div className={isJapaneseInkMode ? 'text-stone-550' : 'text-slate-400'}>Core Focus Area:</div>
                              <div className={isJapaneseInkMode ? 'text-red-700/90' : 'text-emerald-300/90'}>&bull; Computer Hardware & Systems Interoperability</div>
                              <div className={isJapaneseInkMode ? 'text-red-700/90' : 'text-emerald-300/90'}>&bull; Object-Oriented Analysis & Design Patterns (C++, Java)</div>
                              <div className={isJapaneseInkMode ? 'text-red-700/90' : 'text-emerald-300/90'}>&bull; Data Structures, Algorithms & Database Management</div>
                            </>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
