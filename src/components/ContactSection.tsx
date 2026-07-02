import React, { useState, useEffect } from 'react';
import CopyToClipboard from './CopyToClipboard';
import { Mail, Phone, MapPin, Send, MessageSquare, ShieldAlert, History, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SavedMessage {
  id: string;
  name: string;
  email: string;
  purpose: string;
  message: string;
  timestamp: string;
}

interface ContactSectionProps {
  isJapaneseInkMode?: boolean;
}

export default function ContactSection({ isJapaneseInkMode = false }: ContactSectionProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [purpose, setPurpose] = useState('Recruitment');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [savedMessages, setSavedMessages] = useState<SavedMessage[]>([]);

  // Load saved messages from LocalStorage
  useEffect(() => {
    const stored = localStorage.getItem('sandeep_portfolio_messages');
    if (stored) {
      try {
        setSavedMessages(JSON.parse(stored));
      } catch (err) {
        console.error('Failed to parse stored messages', err);
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setIsSending(true);

    // Simulate sending network request
    setTimeout(() => {
      const newMessage: SavedMessage = {
        id: `msg-${Date.now()}`,
        name,
        email,
        purpose,
        message,
        timestamp: new Date().toLocaleString()
      };

      const updated = [newMessage, ...savedMessages];
      setSavedMessages(updated);
      localStorage.setItem('sandeep_portfolio_messages', JSON.stringify(updated));

      setIsSending(false);
      setIsSuccess(true);
      setName('');
      setEmail('');
      setMessage('');

      // Clear success badge after 3.5s
      setTimeout(() => {
        setIsSuccess(false);
      }, 3500);
    }, 1200);
  };

  const deleteMessage = (id: string) => {
    const updated = savedMessages.filter(msg => msg.id !== id);
    setSavedMessages(updated);
    localStorage.setItem('sandeep_portfolio_messages', JSON.stringify(updated));
  };

  return (
    <div id="contact-section" className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Contact info cards - 5 columns */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <div>
          <h2 className={`font-display text-xl font-extrabold tracking-tight transition-colors duration-500 ${
            isJapaneseInkMode ? 'text-stone-900' : 'text-slate-100'
          }`}>
            Connect & Communications
          </h2>
          <p className={`text-sm mt-2 leading-relaxed transition-colors duration-500 ${
            isJapaneseInkMode ? 'text-stone-650' : 'text-slate-400'
          }`}>
            Interested in hiring, collaborating, or discussing graphics rendering optimization? Reach out directly via traditional protocols or leave a secure digital payload.
          </p>
        </div>

        {/* Traditional Contact Cards */}
        <div className="space-y-4">
          {/* Email Card */}
          <div className={`rounded-xl border p-4.5 flex items-start gap-4 transition-all duration-500 ${
            isJapaneseInkMode 
              ? 'border-stone-300/85 bg-[#f5f4f0]/65 backdrop-blur-md hover:bg-[#f5f4f0]/85 hover:border-red-600/40 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_4px_16px_rgba(41,37,36,0.03)]' 
              : 'border-white/[0.08] bg-slate-950/45 backdrop-blur-xl hover:bg-slate-950/55 hover:border-cyan-500/45 hover:shadow-[0_12px_32px_rgba(6,182,212,0.05)] shadow-[inset_0_1px_2px_rgba(255,255,255,0.05),0_8px_24px_rgba(0,0,0,0.35)]'
          }`}>
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg flex-shrink-0 shadow-inner transition-colors duration-500 ${
              isJapaneseInkMode ? 'bg-red-500/10 border border-red-500/20' : 'bg-cyan-950/60 border border-cyan-900/40'
            }`}>
              <Mail className={`h-5 w-5 ${isJapaneseInkMode ? 'text-red-700' : 'text-cyan-400'}`} />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">EMAIL ADDRESS</span>
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                <CopyToClipboard text="Sandeep.thaparcse@gmail.com" label="email" />
              </div>
            </div>
          </div>

          {/* Phone Card */}
          <div className={`rounded-xl border p-4.5 flex items-start gap-4 transition-all duration-500 ${
            isJapaneseInkMode 
              ? 'border-stone-300/85 bg-[#f5f4f0]/65 backdrop-blur-md hover:bg-[#f5f4f0]/85 hover:border-red-600/40 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_4px_16px_rgba(41,37,36,0.03)]' 
              : 'border-white/[0.08] bg-slate-950/45 backdrop-blur-xl hover:bg-slate-950/55 hover:border-emerald-500/45 hover:shadow-[0_12px_32px_rgba(16,185,129,0.05)] shadow-[inset_0_1px_2px_rgba(255,255,255,0.05),0_8px_24px_rgba(0,0,0,0.35)]'
          }`}>
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg flex-shrink-0 shadow-inner transition-colors duration-500 ${
              isJapaneseInkMode ? 'bg-red-500/10 border border-red-500/20' : 'bg-emerald-950/60 border border-emerald-900/40'
            }`}>
              <Phone className={`h-5 w-5 ${isJapaneseInkMode ? 'text-red-700' : 'text-emerald-400'}`} />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">PHONE PROTOCOL</span>
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                <CopyToClipboard text="+91-6284901073" label="phone" />
              </div>
            </div>
          </div>

          {/* Location Card */}
          <div className={`rounded-xl border p-4.5 flex items-start gap-4 transition-all duration-500 ${
            isJapaneseInkMode 
              ? 'border-stone-300/85 bg-[#f5f4f0]/65 backdrop-blur-md hover:bg-[#f5f4f0]/85 hover:border-red-600/40 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_4px_16px_rgba(41,37,36,0.03)]' 
              : 'border-white/[0.08] bg-slate-950/45 backdrop-blur-xl hover:bg-slate-950/55 hover:border-slate-500/45 hover:shadow-[0_12px_32px_rgba(148,163,184,0.05)] shadow-[inset_0_1px_2px_rgba(255,255,255,0.05),0_8px_24px_rgba(0,0,0,0.35)]'
          }`}>
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg flex-shrink-0 shadow-inner transition-colors duration-500 ${
              isJapaneseInkMode ? 'bg-stone-200 border border-stone-300' : 'bg-slate-950/60 border border-white/[0.04]'
            }`}>
              <MapPin className={`h-5 w-5 ${isJapaneseInkMode ? 'text-stone-700' : 'text-slate-400'}`} />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">CURRENT REGION</span>
              <span className={`mt-1 text-sm font-semibold block transition-colors duration-500 ${
                isJapaneseInkMode ? 'text-stone-850' : 'text-slate-200'
              }`}>Windsor, ON, Canada &bull; Punjab, India</span>
            </div>
          </div>
        </div>

        {/* Security / Dev footnote */}
        <div className={`rounded-lg p-4 border flex items-start gap-3 transition-colors duration-500 ${
          isJapaneseInkMode ? 'bg-stone-200/50 border-stone-300' : 'bg-slate-950/40 border border-white/[0.04]'
        }`}>
          <ShieldAlert className={`h-4 w-4 mt-0.5 flex-shrink-0 ${isJapaneseInkMode ? 'text-red-700' : 'text-cyan-500'}`} />
          <span className="text-[11px] font-mono text-slate-500 leading-normal">
            NOTE: This terminal runs entirely over secure endpoints. Messages left in the dashboard payload are preserved locally on your machine via LocalStorage engine.
          </span>
        </div>
      </div>

      {/* Leave a message form - 7 columns */}
      <div className="lg:col-span-7 flex flex-col h-full">
        <div className={`rounded-2xl border p-6 flex-1 flex flex-col justify-between transition-all duration-500 ${
          isJapaneseInkMode
            ? 'border-stone-300/80 bg-[#f5f4f0]/65 backdrop-blur-md hover:bg-[#f5f4f0]/85 hover:border-red-600/40 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_8px_32px_rgba(41,37,36,0.05)]'
            : 'border-white/[0.08] bg-slate-950/45 backdrop-blur-xl shadow-[inset_0_1px_2px_rgba(255,255,255,0.05),0_12px_40px_rgba(0,0,0,0.4)] hover:bg-slate-950/55 hover:border-cyan-500/45 hover:shadow-[0_20px_50px_rgba(6,182,212,0.08)]'
        }`}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className={`h-4.5 w-4.5 ${isJapaneseInkMode ? 'text-red-700' : 'text-cyan-400'}`} />
              <h3 className={`font-display text-base font-bold transition-colors duration-500 ${
                isJapaneseInkMode ? 'text-stone-900' : 'text-slate-200'
              }`}>Transmit Digital Payload</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">YOUR NAME</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Recruiter / Tech Lead"
                  className={`rounded-lg border px-3 py-2 text-sm transition-all focus:outline-none focus:ring-1 ${
                    isJapaneseInkMode
                      ? 'border-stone-300 bg-stone-50 text-stone-900 placeholder-stone-400 focus:border-red-600/60 focus:bg-white focus:ring-red-600/20'
                      : 'border-white/[0.04] bg-slate-950/40 text-slate-200 placeholder-slate-600 focus:border-cyan-500/60 focus:bg-slate-950/70 focus:ring-cyan-500/30'
                  }`}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">EMAIL ADDRESS</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. contact@company.com"
                  className={`rounded-lg border px-3 py-2 text-sm transition-all focus:outline-none focus:ring-1 ${
                    isJapaneseInkMode
                      ? 'border-stone-300 bg-stone-50 text-stone-900 placeholder-stone-400 focus:border-red-600/60 focus:bg-white focus:ring-red-600/20'
                      : 'border-white/[0.04] bg-slate-950/40 text-slate-200 placeholder-slate-600 focus:border-cyan-500/60 focus:bg-slate-950/70 focus:ring-cyan-500/30'
                  }`}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">TRANSMISSION PURPOSE</label>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className={`rounded-lg border px-3 py-2 text-sm appearance-none cursor-pointer focus:outline-none focus:ring-1 ${
                  isJapaneseInkMode
                    ? 'border-stone-300 bg-stone-50 text-stone-900 focus:border-red-600/60 focus:bg-white focus:ring-red-600/20'
                    : 'border-white/[0.04] bg-slate-950/40 text-slate-200 focus:border-cyan-500/60 focus:bg-slate-950/70 focus:ring-cyan-500/30'
                }`}
              >
                <option value="Recruitment">Recruitment (Full-time / Co-op)</option>
                <option value="Freelance">Freelance Contract</option>
                <option value="Technical Collaboration">Technical Collaboration</option>
                <option value="General Query">General Inquiry</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">MESSAGE PROTOCOL</label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter details of your project or professional inquiry..."
                className={`rounded-lg border px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 ${
                  isJapaneseInkMode
                    ? 'border-stone-300 bg-stone-50 text-stone-900 placeholder-stone-400 focus:border-red-600/60 focus:bg-white focus:ring-red-600/20'
                    : 'border-white/[0.04] bg-slate-950/40 text-slate-200 placeholder-slate-600 focus:border-cyan-500/60 focus:bg-slate-950/70 focus:ring-cyan-500/30'
                }`}
              />
            </div>

            <div className="relative group/btn pt-2">
              {/* Outer pulsing watery aura ring 1 */}
              <div className={`absolute -inset-1.5 rounded-xl opacity-25 blur-lg group-hover/btn:opacity-45 group-hover/btn:scale-102 transition-all duration-700 animate-pulse pointer-events-none ${
                isJapaneseInkMode ? 'bg-gradient-to-r from-red-600 to-amber-600' : 'bg-gradient-to-r from-cyan-500 to-sky-500'
              }`} />
              
              {/* Inner animated flowing water ring 2 */}
              <div className={`absolute -inset-0.5 rounded-xl opacity-30 group-hover/btn:opacity-60 transition-all duration-500 blur-sm animate-[spin_8s_linear_infinite] pointer-events-none ${
                isJapaneseInkMode ? 'bg-gradient-to-r from-red-500 via-amber-500 to-red-600' : 'bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400'
              }`} />

              <button
                type="submit"
                disabled={isSending}
                className={`relative w-full flex items-center justify-center gap-2 rounded-xl active:scale-[0.98] px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  isJapaneseInkMode
                    ? 'bg-gradient-to-r from-red-700 to-red-500 hover:from-red-600 hover:to-red-400 text-white shadow-[0_0_20px_rgba(185,28,28,0.25)]'
                    : 'bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                } ${
                  isSending ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                <Send className="h-4 w-4" />
                {isSending ? 'TRANSMITTING...' : 'TRANSMIT MESSAGE'}
              </button>
            </div>
          </form>

          {/* Local Payload Message History */}
          {savedMessages.length > 0 && (
            <div className={`mt-6 pt-5 border-t transition-colors duration-500 ${isJapaneseInkMode ? 'border-stone-250' : 'border-white/[0.04]'}`}>
              <div className="flex items-center justify-between mb-3 text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1.5">
                  <History className={`h-3.5 w-3.5 ${isJapaneseInkMode ? 'text-red-700' : 'text-cyan-400'}`} />
                  LOCAL PAYLOAD LOGS ({savedMessages.length})
                </span>
                <button
                  onClick={() => {
                    localStorage.removeItem('sandeep_portfolio_messages');
                    setSavedMessages([]);
                  }}
                  className="text-[10px] text-rose-500 hover:text-rose-400 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="h-3 w-3" /> Clear Logs
                </button>
              </div>

              <div className="max-h-[160px] overflow-y-auto space-y-3.5 pr-2">
                <AnimatePresence>
                  {savedMessages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className={`rounded-lg border p-3 relative group transition-colors duration-500 ${
                        isJapaneseInkMode 
                          ? 'bg-stone-50 border-stone-250' 
                          : 'bg-slate-950/40 border-white/[0.04]'
                      }`}
                    >
                      <button
                        onClick={() => deleteMessage(msg.id)}
                        className={`absolute right-2 top-2 h-5 w-5 flex items-center justify-center text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all rounded cursor-pointer ${
                          isJapaneseInkMode ? 'bg-stone-200 hover:bg-stone-300/60' : 'bg-slate-900'
                        }`}
                        title="Delete record"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-bold transition-colors duration-500 ${isJapaneseInkMode ? 'text-stone-900' : 'text-slate-200'}`}>{msg.name}</span>
                        <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded uppercase tracking-widest transition-colors duration-500 ${
                          isJapaneseInkMode ? 'bg-stone-200 text-red-700' : 'bg-slate-800 text-cyan-400'
                        }`}>
                          {msg.purpose}
                        </span>
                      </div>
                      <p className={`text-xs leading-relaxed pr-4 transition-colors duration-500 ${isJapaneseInkMode ? 'text-stone-750' : 'text-slate-300'}`}>{msg.message}</p>
                      <span className="text-[9px] font-mono text-slate-500 mt-1.5 block">
                        Timestamp: {msg.timestamp}
                      </span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
