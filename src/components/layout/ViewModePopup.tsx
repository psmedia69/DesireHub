import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Smartphone, Tablet, Monitor, Layout, Sparkles } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface ViewModePopupProps {
  onSelect: (mode: "Phone" | "Tab" | "Web", isLowData: boolean) => void;
}

export const ViewModePopup: React.FC<ViewModePopupProps> = ({ onSelect }) => {
  const [selectedMode, setSelectedMode] = React.useState<"Phone" | "Tab" | "Web" | null>(null);
  
  const modes = [
    { id: "Phone", name: "Mobile", icon: Smartphone, desc: "Compact Experience" },
    { id: "Tab", name: "Tablet", icon: Tablet, desc: "Balanced Layout" },
    { id: "Web", name: "Desktop", icon: Monitor, desc: "Full Desktop Experience" }
  ] as const;

  const handleDeviceSelect = (mode: "Phone" | "Tab" | "Web") => {
    setSelectedMode(mode);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-0">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-black/95 backdrop-blur-2xl"
      />
      
      <AnimatePresence mode="wait">
        {!selectedMode ? (
          <motion.div 
            key="device-selection"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: -50, scale: 0.9 }}
            className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-8 md:p-12 overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,1)]"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-50" />
            <div className="text-center space-y-4 mb-10">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
                  <Layout className="w-8 h-8 text-gold" />
                </div>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                CHOOSE YOUR <span className="text-gold">VIEW</span>
              </h2>
              <p className="text-white/40 text-sm font-medium uppercase tracking-widest leading-relaxed">
                Select an interface optimized for your preference
              </p>
            </div>

            <div className="grid gap-4">
              {modes.map((mode) => (
                <motion.button
                  key={mode.id}
                  whileHover={{ x: 8, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDeviceSelect(mode.id)}
                  className="flex items-center gap-6 p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-gold/50 hover:bg-gold/5 transition-all text-left group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-center group-hover:border-gold/30 transition-colors">
                    <mode.icon className="w-7 h-7 text-white/70 group-hover:text-gold transition-colors" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-lg">{mode.name}</div>
                    <div className="text-white/40 text-sm font-medium">{mode.desc}</div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="optimization-selection"
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/20 rounded-[2.5rem] p-8 md:p-12 overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,1)]"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-50" />
            <div className="text-center space-y-6 mb-10">
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center relative">
                  <Sparkles className="w-10 h-10 text-gold animate-pulse" />
                  <div className="absolute inset-0 bg-gold/20 blur-xl rounded-full" />
                </div>
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-black text-white tracking-tight uppercase">
                  Optimization <span className="text-gold">Center</span>
                </h2>
                <div className="bg-gold/10 border border-gold/20 rounded-2xl p-4">
                  <p className="text-gold text-xs font-bold uppercase tracking-widest leading-relaxed">
                    Recommended for mobile & low-end devices
                  </p>
                </div>
                <p className="text-white/50 text-sm font-medium leading-relaxed max-w-[280px] mx-auto">
                  If you want to proceed in low data mode for faster loading and less lag, click the button below.
                </p>
              </div>
            </div>

            <div className="grid gap-4">
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelect(selectedMode, true)}
                className="w-full bg-gold text-black py-6 rounded-2xl font-black text-sm uppercase tracking-[0.25em] flex items-center justify-center gap-3 shadow-[0_15px_40px_rgba(212,175,55,0.3)] border border-gold"
              >
                Launch Low Data Mode
                <Sparkles className="w-5 h-5" />
              </motion.button>

              <button
                onClick={() => onSelect(selectedMode, false)}
                className="w-full py-6 rounded-2xl bg-white/5 border border-white/10 text-white/50 font-black text-sm uppercase tracking-[0.25em] hover:bg-white/10 transition-colors"
              >
                Standard Experience
              </button>
            </div>

            <button 
              onClick={() => setSelectedMode(null)}
              className="mt-8 w-full text-center text-[10px] text-white/20 uppercase font-black tracking-[0.2em] hover:text-white/40 transition-colors"
            >
              ← Back to View Selection
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
