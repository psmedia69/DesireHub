import React, { useState, useRef, useEffect } from "react";
import { SortOption } from "@/src/types";
import { cn } from "@/src/lib/utils";
import { ListFilter, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SortingFiltersProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const SORT_OPTIONS = [
  { id: 'newest', label: 'Newest' },
  { id: 'oldest', label: 'Oldest' },
  { id: 'name-asc', label: 'A-Z' },
  { id: 'name-desc', label: 'Z-A' },
  { id: 'popular', label: 'Popular' },
  { id: 'random', label: 'Random' }
];

export default function SortingFilters({ sortBy, onSortChange }: SortingFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentLabel = SORT_OPTIONS.find(opt => opt.id === sortBy)?.label || "Sorting";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-4 glass-panel px-6 py-2.5 rounded-full border border-white/10 h-fit hover:bg-white/10 transition-all group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <ListFilter className="w-4 h-4 text-gold shrink-0" />
        <span className="text-[12px] font-black uppercase tracking-[0.15em] text-white group-hover:text-white whitespace-nowrap">
          Sort: <span className="text-gold tracking-[0.1em]">{currentLabel}</span>
        </span>
        <ChevronDown className={cn("w-4 h-4 text-white/30 transition-transform duration-500 shrink-0", isOpen && "rotate-180")} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 top-full mt-4 w-52 glass-panel rounded-2xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 overflow-hidden backdrop-blur-3xl"
          >
            <div className="p-2 space-y-1">
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    onSortChange(option.id as SortOption);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-between group/item",
                    sortBy === option.id 
                      ? "bg-linear-to-r from-gold to-[#b8860b] text-black shadow-lg" 
                      : "text-white/50 hover:text-white hover:bg-white/5"
                  )}
                >
                  {option.label}
                  {sortBy === option.id && (
                    <motion.div 
                      layoutId="sortTick"
                      className="w-1.5 h-1.5 rounded-full bg-black"
                    />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
