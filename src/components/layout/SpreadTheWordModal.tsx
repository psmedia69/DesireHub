import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Link, Download, Check, Copy, Megaphone, Share2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { toast } from 'sonner';

interface SpreadTheWordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SpreadTheWordModal({ isOpen, onClose }: SpreadTheWordModalProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const promoLink = window.location.origin;
  
  const marketingCaptions = [
    {
      title: "The Premium Directory",
      text: `Check out the new Premium Model Directory! 🥵\nAll the best desi & international models in one place.\n\nVisit now: ${promoLink}\nJoin our TG: https://t.me/+fiYQGTL55EdkMDI1`
    },
    {
      title: "Desire HUB Launch",
      text: `DESIRE HUB is finally live! 🚀\nExclusive directory with high-quality content only.\n\nBrowse models: ${promoLink}\nDon't miss out!`
    },
    {
      title: "Telegram Community",
      text: `Join the biggest model community on Telegram!\nDaily updates and exclusive redirects.\n\nTG: https://t.me/+fiYQGTL55EdkMDI1\nWeb: ${promoLink}`
    }
  ];

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success('Campaign text copied!', { icon: '📋' });
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-black border border-gold/30 rounded-[2.5rem] overflow-hidden shadow-[0_0_100px_rgba(212,175,55,0.15)]"
          >
            {/* Header */}
            <div className="p-8 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gold/10 border border-gold/30 flex items-center justify-center">
                  <Megaphone className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white uppercase tracking-wider">Spread The Word</h2>
                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">Viral Marketing Kit</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar space-y-8">
              {/* Campaign Messages */}
              <div className="space-y-4">
                <h3 className="text-gold text-[10px] font-bold uppercase tracking-[0.3em] flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-gold animate-pulse" />
                  Pre-written Ads
                </h3>
                
                <div className="grid gap-4">
                  {marketingCaptions.map((caption, idx) => (
                    <div 
                      key={idx}
                      className="group relative p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-gold/30 transition-all"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{caption.title}</span>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleCopy(caption.text, idx)}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all"
                            title="Copy to clipboard"
                          >
                            {copiedIndex === idx ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-white/80 font-medium whitespace-pre-wrap leading-relaxed">
                        {caption.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Direct Promotion Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a 
                  href="https://t.me/+fiYQGTL55EdkMDI1" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-5 rounded-2xl bg-blue-600/10 border border-blue-600/30 hover:bg-blue-600/20 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center">
                    <Send className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <div className="text-white font-black uppercase tracking-widest text-[10px]">Invite to TG</div>
                    <div className="text-white/40 text-[9px] font-bold">Fast-track our growth</div>
                  </div>
                </a>

                <button 
                  onClick={() => handleCopy(promoLink, 999)}
                  className="flex items-center gap-4 p-5 rounded-2xl bg-gold/10 border border-gold/30 hover:bg-gold/20 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center">
                    <Link className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <div className="text-white font-black uppercase tracking-widest text-[10px]">Direct Link</div>
                    <div className="text-white/40 text-[9px] font-bold">Copy portal URL</div>
                  </div>
                </button>
              </div>

              {/* Tips for viral growth */}
              <div className="p-6 rounded-2xl bg-linear-to-br from-gold/5 to-transparent border border-gold/20">
                <h4 className="text-gold text-[11px] font-black uppercase tracking-widest mb-3">🔥 Growth Hacks</h4>
                <ul className="space-y-3">
                  {[
                    "Post our models on high-traffic Reddit subreddits.",
                    "Tag us in your Twitter/Instagram stories.",
                    "Share the TG link in other relevant communities.",
                    "Tell your friends about the high-quality redirects."
                  ].map((tip, i) => (
                    <li key={i} className="flex items-start gap-3 text-white/60 text-xs leading-tight">
                      <div className="w-1.5 h-1.5 rounded-full bg-gold mt-1 shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="p-8 border-t border-white/10 bg-white/[0.01] text-center">
              <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">
                Stronger Together • Desire HUB Community
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
