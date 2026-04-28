import React from "react";
import { motion } from "motion/react";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface InFeedCTAProps {
  viewMode?: string;
}

export default function InFeedCTA({ viewMode }: InFeedCTAProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn(
        "col-span-full my-8 p-6 glass-premium rounded-[2rem] border border-gold/30 relative overflow-hidden group",
        viewMode === "Phone" ? "mx-2" : ""
      )}
    >
      <div className="absolute inset-0 bg-gold/5 blur-[100px] -z-10 group-hover:bg-gold/10 transition-colors duration-700" />
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gold/20 flex items-center justify-center border border-gold/40">
            <ShieldCheck className="w-6 h-6 text-gold" />
          </div>
          <div className="text-left">
            <h3 className="text-white text-lg font-black uppercase tracking-widest leading-tight">
              🔓 Want full access?
            </h3>
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-1">
              Join the private channel for daily updates
            </p>
          </div>
        </div>

        <motion.a
          href="https://t.me/+fiYQGTL55EdkMDI1"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05, x: 5 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gold text-black px-8 py-3 rounded-xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center gap-2 shadow-[0_10px_30px_rgba(212,175,55,0.3)]"
        >
          Continue Unlock Process
          <ArrowRight className="w-4 h-4" />
        </motion.a>
      </div>
    </motion.div>
  );
}
