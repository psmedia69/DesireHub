import React from "react";
import { motion } from "motion/react";
import { Smartphone, Tablet, Monitor, Layout } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface ViewModePopupProps {
  onSelect: (mode: "Phone" | "Tab" | "Web") => void;
}

export const ViewModePopup: React.FC<ViewModePopupProps> = ({ onSelect }) => {
  const modes = [
    { id: "Phone", name: "Mobile", icon: Smartphone, desc: "Compact Experience" },
    { id: "Tab", name: "Tablet", icon: Tablet, desc: "Balanced Layout" },
    { id: "Web", name: "Desktop", icon: Monitor, desc: "Full Premium View" }
  ] as const;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-0">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-black/95 backdrop-blur-2xl"
      />
      
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-8 md:p-12 overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,1)]"
      >
        {/* Glow Header */}
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
              onClick={() => onSelect(mode.id)}
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

        <p className="mt-10 text-center text-[10px] text-white/20 uppercase font-black tracking-[0.2em]">
          Mode is locked until next refresh
        </p>
      </motion.div>
    </div>
  );
};
