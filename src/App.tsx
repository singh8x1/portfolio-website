import React, { useState } from 'react';
import { PERSONAL_INFO, PROJECT_LIST } from './data';
import CopyToClipboard from './components/CopyToClipboard';
import GraphicsSandbox from './components/GraphicsSandbox';
import ProjectCard from './components/ProjectCard';
import TimelineSection from './components/TimelineSection';
import ContactSection from './components/ContactSection';
import SkillsGrid from './components/SkillsGrid';
import WesternDragon from './components/WesternDragon';
import {
  FileCode,
  Download,
  Printer,
  ChevronDown,
  Filter,
  X,
  Sparkles,
  Github,
  Linkedin,
  MapPin,
  Cpu,
  Mail,
  Smartphone
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from 'motion/react';
import profileImg from './assets/profile.jpg?v=2';

export default function App() {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'graphics' | 'fullstack'>('all');
  const [isJapaneseInkMode, setIsJapaneseInkMode] = useState<boolean>(false);

  // Liquid scroll-linked animations for the top status and progress
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 85,
    damping: 24,
    restDelta: 0.001
  });

  const dropletTop = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const dropletY = useTransform(scrollYProgress, [0, 1], ["0px", "-20px"]);

  // Filter projects based on selected skill or category tab
  const filteredProjects = PROJECT_LIST.filter((proj) => {
    // 1. Skill filter
    if (selectedSkill) {
      return proj.technologies.some(
        (tech) => tech.toLowerCase() === selectedSkill.toLowerCase()
      );
    }
    // 2. Category tab filter
    if (activeTab === 'graphics') {
      return proj.technologies.some((tech) =>
        ['unity', 'opengl', 'ar core', 'google ar', 'c#', 'shader programming'].includes(
          tech.toLowerCase()
        )
      );
    }
    if (activeTab === 'fullstack') {
      return proj.technologies.some((tech) =>
        ['react', 'django', 'fastapi', 'node.js', 'mysql', 'firebase', 'pyspark', 'python'].includes(
          tech.toLowerCase()
        )
      );
    }
    return true;
  });

  const handleSelectSkill = (skill: string) => {
    if (selectedSkill === skill) {
      setSelectedSkill(null); // toggle off
    } else {
      setSelectedSkill(skill);
      // Clear tab filter since skill filter overrides it
      setActiveTab('all');
    }
  };

  // Export Resume as JSON
  const handleExportJSON = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(PERSONAL_INFO, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'sandeep_singh_resume.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-700 ${
      isJapaneseInkMode 
        ? 'bg-[#f5f4f0] washi-paper text-stone-800 selection:bg-red-700/20 selection:text-red-900' 
        : 'bg-[#020617] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200'
    }`}>
      {/* Floating Theme Controller Switch */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsJapaneseInkMode(!isJapaneseInkMode)}
          className={`flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-mono font-bold shadow-lg backdrop-blur-md transition-all duration-500 cursor-pointer ${
            isJapaneseInkMode 
              ? 'bg-[#1c1917]/90 text-[#f5f4f0] border-stone-400 hover:bg-[#292524] shadow-md' 
              : 'bg-slate-950/90 text-cyan-400 border-slate-800 hover:bg-slate-900 hover:border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
          }`}
        >
          <span className={`h-2 w-2 rounded-full transition-all duration-500 ${
            isJapaneseInkMode ? 'bg-red-600 animate-pulse' : 'bg-cyan-400 animate-pulse'
          }`} />
          {isJapaneseInkMode ? 'SUMI-E PAPER MODE' : 'COSMIC ABYSS MODE'}
        </motion.button>
      </div>

      {/* Liquid scroll-linked progress bar */}
      <motion.div
        className={`fixed top-0 left-0 right-0 h-1 origin-left z-50 pointer-events-none rounded-r-full transition-all duration-500 ${
          isJapaneseInkMode 
            ? 'bg-stone-800 shadow-[0_0_8px_rgba(41,37,36,0.3)]' 
            : 'bg-gradient-to-r from-cyan-500 via-sky-400 to-indigo-500 shadow-[0_0_15px_rgba(6,182,212,0.6)]'
        }`}
        style={{ scaleX }}
      />

      {/* Side Glassy Liquid Scroll Track & Droplet Indicator */}
      <div className="fixed right-4.5 top-1/4 bottom-1/4 w-2.5 hidden xl:flex flex-col items-center justify-between z-40 pointer-events-none">
        <div className={`relative w-1.5 h-full rounded-full border shadow-[inset_0_1px_3px_rgba(0,0,0,0.8)] flex justify-center transition-all duration-500 ${
          isJapaneseInkMode ? 'bg-stone-200/50 border-stone-300' : 'bg-slate-900/40 backdrop-blur-md border-white/[0.03]'
        }`}>
          {/* Glowing water drop that slides dynamically based on scrollYProgress */}
          <motion.div
            className={`absolute w-3.5 h-5 shadow-[inset_0_-1px_3px_rgba(255,255,255,0.4)] ${
              isJapaneseInkMode 
                ? 'bg-gradient-to-b from-red-600 to-red-800 shadow-[0_0_8px_rgba(220,38,38,0.5)]' 
                : 'bg-gradient-to-b from-cyan-400 via-sky-400 to-indigo-500 shadow-[0_0_12px_rgba(34,211,238,0.65)]'
            }`}
            style={{
              top: dropletTop,
              y: dropletY,
              borderRadius: "45% 45% 50% 50% / 40% 40% 60% 60%", // Droplet shape
            }}
            animate={{
              scaleX: [1, 1.15, 0.9, 1],
              scaleY: [1, 0.9, 1.15, 1],
            }}
            transition={{
              duration: 2.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      </div>

      {/* Majestic Western Dragon loader & interactive bird-chaser */}
      <WesternDragon isJapaneseInkMode={isJapaneseInkMode} />

      {/* Background ambient glows - Animated like liquid bubbles floating */}
      <motion.div 
        animate={{
          x: [0, 40, -20, 0],
          y: [0, -30, 40, 0],
          scale: [1, 1.08, 0.92, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className={`absolute top-0 left-1/4 w-96 h-96 rounded-full blur-[120px] pointer-events-none transition-colors duration-500 ${
          isJapaneseInkMode ? 'bg-stone-400/5' : 'bg-cyan-500/5'
        }`} 
      />
      <motion.div 
        animate={{
          x: [0, -50, 30, 0],
          y: [0, 40, -35, 0],
          scale: [1, 0.92, 1.08, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className={`absolute top-1/3 right-1/4 w-[500px] h-[500px] rounded-full blur-[150px] pointer-events-none transition-colors duration-500 ${
          isJapaneseInkMode ? 'bg-stone-300/10' : 'bg-indigo-500/5'
        }`} 
      />
      <motion.div 
        animate={{
          x: [0, 35, -35, 0],
          y: [0, 25, 45, 0],
          scale: [1, 1.05, 0.95, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className={`absolute bottom-10 left-1/3 w-80 h-80 rounded-full blur-[120px] pointer-events-none transition-colors duration-500 ${
          isJapaneseInkMode ? 'bg-red-400/5' : 'bg-emerald-500/5'
        }`} 
      />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
        {/* Header Block (Bento-like Hero Section) */}
        <motion.header 
          initial={{ opacity: 0, y: 35, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 50, damping: 18 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10"
        >
          {/* Avatar / Profile - 4 Cols */}
          <div className={`lg:col-span-4 rounded-2xl border p-6 flex flex-col items-center justify-center text-center shadow-lg transition-all duration-500 group ${
            isJapaneseInkMode 
              ? 'border-stone-300/80 bg-[#f5f4f0]/65 backdrop-blur-md hover:bg-[#f5f4f0]/85 hover:border-red-500/40 text-stone-800 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_8px_32px_rgba(41,37,36,0.06)]' 
              : 'border-white/[0.08] bg-slate-950/45 backdrop-blur-xl hover:bg-slate-950/55 hover:border-cyan-500/45 hover:shadow-[0_20px_50px_rgba(6,182,212,0.08)] shadow-[inset_0_1px_2px_rgba(255,255,255,0.05),0_12px_40px_rgba(0,0,0,0.5)]'
          }`}>
            {/* Custom Monogram Avatar with animated glow */}
            <div className="relative mb-5 group">
              {/* Outer pulsing watery aura ring 1 */}
              <div className={`absolute -inset-2.5 rounded-3xl opacity-20 blur-md group-hover:opacity-40 group-hover:scale-105 transition-all duration-700 animate-pulse pointer-events-none ${
                isJapaneseInkMode ? 'bg-gradient-to-r from-red-600 to-amber-500' : 'bg-gradient-to-r from-cyan-500 to-indigo-500'
              }`} />
              
              {/* Inner animated flowing water ring 2 */}
              <div className={`absolute -inset-1 rounded-3xl opacity-25 group-hover:opacity-50 transition-all duration-500 blur-xs animate-[spin_10s_linear_infinite] pointer-events-none ${
                isJapaneseInkMode ? 'bg-gradient-to-tr from-red-500 via-amber-400 to-stone-400' : 'bg-gradient-to-tr from-cyan-400 via-sky-300 to-indigo-400'
              }`} />

              <div className={`relative flex items-center justify-center h-28 w-28 rounded-2xl overflow-hidden transition-all duration-500 border ${
                isJapaneseInkMode 
                  ? 'bg-stone-200/90 border-stone-300 shadow-inner hover:border-red-500/40' 
                  : 'bg-slate-950/40 backdrop-blur-md border-white/[0.04] shadow-2xl shadow-cyan-500/5 hover:border-cyan-500/30'
              }`}>
                <img 
                  src={profileImg} 
                  alt="Sandeep Singh" 
                  className="w-full h-full object-cover transition-all duration-700"
                />
                <span className={`monogram hidden font-display text-4xl font-black tracking-tighter ${
                  isJapaneseInkMode 
                    ? 'text-stone-800' 
                    : 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400'
                }`}>
                  SS
                </span>
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                  isJapaneseInkMode ? 'bg-red-500/5' : 'bg-cyan-500/5'
                }`} />
                {/* Decorative graphic corners */}
                <div className={`absolute top-2 left-2 w-2 h-2 border-t border-l ${isJapaneseInkMode ? 'border-red-700/50' : 'border-cyan-400/50'}`} />
                <div className={`absolute top-2 right-2 w-2 h-2 border-t border-r ${isJapaneseInkMode ? 'border-red-700/50' : 'border-cyan-400/50'}`} />
                <div className={`absolute bottom-2 left-2 w-2 h-2 border-b border-l ${isJapaneseInkMode ? 'border-red-700/50' : 'border-cyan-400/50'}`} />
                <div className={`absolute bottom-2 right-2 w-2 h-2 border-b border-r ${isJapaneseInkMode ? 'border-red-700/50' : 'border-cyan-400/50'}`} />
              </div>
            </div>

            <h1 className={`font-display text-2xl font-black tracking-tight mb-1.5 transition-colors duration-500 ${
              isJapaneseInkMode ? 'text-stone-800' : 'text-white'
            }`}>
              {PERSONAL_INFO.name}
            </h1>
            <p className={`font-mono text-xs font-semibold uppercase tracking-widest mb-4 transition-colors duration-500 ${
              isJapaneseInkMode ? 'text-red-700' : 'text-cyan-400'
            }`}>
              {PERSONAL_INFO.title}
            </p>

            {/* Quick Actions */}
            <div className="flex gap-2 w-full max-w-[280px]">
              <button
                onClick={handleExportJSON}
                className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg border py-2 px-3 text-xs font-mono font-medium transition-all cursor-pointer ${
                  isJapaneseInkMode 
                    ? 'border-stone-300 bg-stone-100 text-stone-700 hover:border-red-500/40 hover:bg-stone-200 hover:text-stone-950 shadow-sm' 
                    : 'border-slate-800/40 bg-slate-950/30 backdrop-blur-sm text-slate-300 hover:border-cyan-500/40 hover:bg-slate-950/60 hover:text-white'
                }`}
                title="Export Resume Data in JSON schema"
              >
                <FileCode className={`h-3.5 w-3.5 ${isJapaneseInkMode ? 'text-stone-700' : 'text-cyan-400'}`} />
                EXPORT
              </button>
              <button
                onClick={handlePrint}
                className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg border py-2 px-3 text-xs font-mono font-medium transition-all cursor-pointer ${
                  isJapaneseInkMode 
                    ? 'border-stone-300 bg-stone-100 text-stone-700 hover:border-red-500/40 hover:bg-stone-200 hover:text-stone-950 shadow-sm' 
                    : 'border-slate-800/40 bg-slate-950/30 backdrop-blur-sm text-slate-300 hover:border-cyan-500/40 hover:bg-slate-950/60 hover:text-white'
                }`}
                title="Print clean layout"
              >
                <Printer className={`h-3.5 w-3.5 ${isJapaneseInkMode ? 'text-red-700' : 'text-emerald-400'}`} />
                PRINT
              </button>
            </div>

            {/* Social Channels */}
            <div className={`flex items-center gap-3 mt-5 pt-5 border-t w-full justify-center ${
              isJapaneseInkMode ? 'border-stone-300/60' : 'border-slate-800/40'
            }`}>
              <a
                href={PERSONAL_INFO.github}
                target="_blank"
                rel="noreferrer"
                className={`h-9 w-9 flex items-center justify-center rounded-lg border transition-colors ${
                  isJapaneseInkMode 
                    ? 'bg-stone-100 hover:bg-stone-200 border-stone-300 text-stone-600 hover:text-stone-950 shadow-sm' 
                    : 'bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white'
                }`}
                aria-label="GitHub Profile"
              >
                <Github className="h-4.5 w-4.5" />
              </a>
              <a
                href={PERSONAL_INFO.linkedin}
                target="_blank"
                rel="noreferrer"
                className={`h-9 w-9 flex items-center justify-center rounded-lg border transition-colors ${
                  isJapaneseInkMode 
                    ? 'bg-stone-100 hover:bg-stone-200 border-stone-300 text-stone-600 hover:text-stone-950 shadow-sm' 
                    : 'bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white'
                }`}
                aria-label="LinkedIn Profile"
              >
                <Linkedin className="h-4.5 w-4.5" />
              </a>
              <a
                href="mailto:Sandeep.thaparcse@gmail.com"
                className={`h-9 w-9 flex items-center justify-center rounded-lg border transition-colors ${
                  isJapaneseInkMode 
                    ? 'bg-stone-100 hover:bg-stone-200 border-stone-300 text-stone-600 hover:text-stone-950 shadow-sm' 
                    : 'bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white'
                }`}
                aria-label="Email Send"
              >
                <Mail className="h-4.5 w-4.5" />
              </a>
            </div>
          </div>

          {/* Intro Summary & Metadata - 8 Cols */}
          <div className={`lg:col-span-8 rounded-2xl border p-6 flex flex-col justify-between shadow-lg transition-all duration-500 ${
            isJapaneseInkMode 
              ? 'border-stone-300/80 bg-[#f5f4f0]/65 backdrop-blur-md hover:bg-[#f5f4f0]/85 hover:border-red-500/40 text-stone-800 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_8px_32px_rgba(41,37,36,0.06)]' 
              : 'border-white/[0.08] bg-slate-950/45 backdrop-blur-xl hover:bg-slate-950/55 hover:border-cyan-500/45 hover:shadow-[0_20px_50px_rgba(6,182,212,0.08)] shadow-[inset_0_1px_2px_rgba(255,255,255,0.05),0_12px_40px_rgba(0,0,0,0.5)]'
          }`}>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className={`h-4 w-4 animate-pulse ${isJapaneseInkMode ? 'text-red-700' : 'text-cyan-400'}`} />
                <span className={`font-mono text-[10px] font-bold uppercase tracking-widest ${
                  isJapaneseInkMode ? 'text-red-700' : 'text-cyan-400'
                }`}>
                  Executive Summary Protocol
                </span>
              </div>
              <h2 className={`font-display text-2xl font-black tracking-tight leading-none mb-4 ${
                isJapaneseInkMode ? 'text-stone-900 font-extrabold' : 'text-white'
              }`}>
                {PERSONAL_INFO.subTitle}
              </h2>
              <div className={`space-y-3.5 text-sm sm:text-base leading-relaxed font-sans ${
                isJapaneseInkMode ? 'text-stone-700 font-medium' : 'text-slate-300'
              }`}>
                {PERSONAL_INFO.summary.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Quick specs grid */}
            <div className={`grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t font-mono text-xs ${
              isJapaneseInkMode ? 'border-stone-300/60 text-stone-500' : 'border-slate-800/40 text-slate-400'
            }`}>
              <div className="flex flex-col gap-1">
                <span className="text-stone-500 uppercase text-[9px] tracking-wider">REGIONAL RANGE</span>
                <span className={`font-semibold flex items-center gap-1 ${isJapaneseInkMode ? 'text-stone-800' : 'text-slate-200'}`}>
                  <MapPin className={`h-3 w-3 ${isJapaneseInkMode ? 'text-red-700' : 'text-cyan-400'}`} /> ON, CA / PB, IN
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-stone-500 uppercase text-[9px] tracking-wider">CORE ENGINE</span>
                <span className={`font-semibold flex items-center gap-1 ${isJapaneseInkMode ? 'text-stone-800' : 'text-slate-200'}`}>
                  <Cpu className={`h-3 w-3 ${isJapaneseInkMode ? 'text-stone-700' : 'text-emerald-400'}`} /> React.js & Unity (C#)
                </span>
              </div>
              <div className="col-span-2 sm:col-span-1 flex flex-col gap-1">
                <span className="text-stone-500 uppercase text-[9px] tracking-wider">EXPERIENCE INDEX</span>
                <span className={`font-semibold ${isJapaneseInkMode ? 'text-stone-800' : 'text-slate-200'}`}>4+ Years Active</span>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Section: Technical Skills Bento Matrix */}
        <motion.section 
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ type: "spring", stiffness: 45, damping: 15 }}
          className="mb-10"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className={`flex h-2 w-2 rounded-full ${isJapaneseInkMode ? 'bg-red-700 shadow-sm' : 'bg-cyan-400'}`}></span>
              <h2 className={`font-display text-xl font-black tracking-tight uppercase ${
                isJapaneseInkMode ? 'text-stone-800' : 'text-white'
              }`}>
                Technical Skills Matrix
              </h2>
            </div>
            {selectedSkill && (
              <button
                onClick={() => setSelectedSkill(null)}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-mono font-bold rounded-lg cursor-pointer transition-all duration-300 ${
                  isJapaneseInkMode 
                    ? 'text-red-700 bg-red-100 border border-red-300 hover:bg-red-200' 
                    : 'text-rose-400 bg-rose-950/20 border border-rose-900/50 hover:text-rose-300'
                }`}
              >
                <X className="h-3 w-3" /> Clear Filter: {selectedSkill}
              </button>
            )}
          </div>
          <SkillsGrid onSelectSkill={handleSelectSkill} selectedSkill={selectedSkill} isJapaneseInkMode={isJapaneseInkMode} />
        </motion.section>

        {/* Double grid section: Graphics Engine and History */}
        <motion.section 
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ type: "spring", stiffness: 45, damping: 15 }}
          className="grid grid-cols-1 xl:grid-cols-12 gap-8 mb-10"
        >
          {/* Interactive OpenGL/Unity simulation sandbox - 5 cols */}
          <div className="xl:col-span-5 flex flex-col h-full">
            <GraphicsSandbox isJapaneseInkMode={isJapaneseInkMode} />
          </div>

          {/* Timeline and education - 7 cols */}
          <div className={`xl:col-span-7 rounded-2xl border p-6 flex flex-col justify-between h-full shadow-lg transition-all duration-500 ${
            isJapaneseInkMode 
              ? 'border-stone-300/80 bg-[#f5f4f0]/65 backdrop-blur-md hover:bg-[#f5f4f0]/85 hover:border-red-500/40 text-stone-800 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_8px_32px_rgba(41,37,36,0.06)]' 
              : 'border-white/[0.08] bg-slate-950/45 backdrop-blur-xl hover:bg-slate-950/55 hover:border-cyan-500/45 hover:shadow-[0_20px_50px_rgba(6,182,212,0.08)] shadow-[inset_0_1px_2px_rgba(255,255,255,0.05),0_12px_40px_rgba(0,0,0,0.5)]'
          }`}>
            <TimelineSection isJapaneseInkMode={isJapaneseInkMode} />
          </div>
        </motion.section>

        {/* Section: Project Grid */}
        <motion.section 
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ type: "spring", stiffness: 45, damping: 15 }}
          className="mb-10"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <span className={`flex h-2 w-2 rounded-full ${isJapaneseInkMode ? 'bg-red-700 shadow-sm' : 'bg-emerald-400'}`}></span>
              <h2 className={`font-display text-xl font-black tracking-tight uppercase ${
                isJapaneseInkMode ? 'text-stone-800' : 'text-white'
              }`}>
                Product & Application Portfolios
              </h2>
              {selectedSkill && (
                <span className={`rounded text-[10px] font-mono px-2 py-0.5 ml-2 transition-all duration-300 ${
                  isJapaneseInkMode 
                    ? 'bg-red-100 border border-red-300 text-red-800 font-extrabold' 
                    : 'bg-cyan-950 border border-cyan-800 text-cyan-400'
                }`}>
                  Matching "{selectedSkill}"
                </span>
              )}
            </div>

            {/* Filter controls */}
            <div className="flex items-center gap-2.5">
              <Filter className={`h-3.5 w-3.5 ${isJapaneseInkMode ? 'text-stone-500' : 'text-slate-500'}`} />
              <div className={`flex rounded-lg p-0.5 border transition-all duration-500 ${
                isJapaneseInkMode ? 'bg-stone-200/80 border-stone-300' : 'bg-slate-950 border-slate-900'
              }`}>
                {(['all', 'graphics', 'fullstack'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      setActiveTab(tab);
                      setSelectedSkill(null); // clear skill filter to allow tab filter
                    }}
                    className={`px-3 py-1 text-[11px] font-mono rounded-md transition-all cursor-pointer ${
                      activeTab === tab && !selectedSkill
                        ? isJapaneseInkMode
                          ? 'bg-stone-100 text-red-700 border border-stone-300 shadow-sm font-bold'
                          : 'bg-slate-800 text-cyan-400 border border-slate-700/50 shadow-inner'
                        : isJapaneseInkMode
                        ? 'text-stone-600 hover:text-stone-900'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {tab.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((proj, index) => (
                <ProjectCard key={proj.id} project={proj} index={index} isJapaneseInkMode={isJapaneseInkMode} />
              ))}
            </AnimatePresence>
            {filteredProjects.length === 0 && (
              <div className={`col-span-full py-16 text-center border border-dashed rounded-xl transition-all duration-500 ${
                isJapaneseInkMode 
                  ? 'border-stone-300 bg-stone-100/30' 
                  : 'border-slate-800 bg-slate-950/40'
              }`}>
                <p className={`text-sm font-mono ${isJapaneseInkMode ? 'text-stone-500' : 'text-slate-500'}`}>
                  No core projects matched standard filter configuration.
                </p>
                <button
                  onClick={() => {
                    setSelectedSkill(null);
                    setActiveTab('all');
                  }}
                  className={`mt-3 inline-flex items-center gap-1 px-3 py-1.5 text-xs font-mono rounded-lg cursor-pointer transition-all duration-300 ${
                    isJapaneseInkMode 
                      ? 'text-red-700 border border-red-300 bg-red-50 hover:bg-red-100' 
                      : 'text-cyan-400 border border-cyan-800/60 hover:bg-cyan-950/20'
                  }`}
                >
                  <X className="h-3 w-3" /> Reset Matrix
                </button>
              </div>
            )}
          </div>
        </motion.section>

        {/* Section: Contact communication */}
        <motion.section 
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ type: "spring", stiffness: 45, damping: 15 }}
          className={`border-t pt-10 transition-colors duration-500 ${
            isJapaneseInkMode ? 'border-stone-300' : 'border-slate-900'
          }`}
        >
          <ContactSection isJapaneseInkMode={isJapaneseInkMode} />
        </motion.section>

        {/* Footer info line */}
        <footer className={`mt-16 pt-8 border-t text-center text-xs font-mono flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors duration-500 ${
          isJapaneseInkMode ? 'border-stone-300 text-stone-500' : 'border-slate-900 text-slate-600'
        }`}>
          <div>
            <span>&copy; {new Date().getFullYear()} Sandeep Singh. All Rights Preserved.</span>
          </div>
          <div className="flex gap-4">
            <span className="hover:text-slate-400 transition-colors pointer-events-none">
              v1.4.2-STABLE
            </span>
            <span className={`${isJapaneseInkMode ? 'text-stone-300' : 'text-slate-800'}`}>|</span>
            <span className="hover:text-slate-400 transition-colors pointer-events-none">
              SECURE CONNECT
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
