import { ModelCategory } from "@/src/types";
import { cn } from "@/src/lib/utils";
import { motion } from "motion/react";
import { ViewMode } from "@/src/components/layout/ViewSwitcher";

interface CategoryFiltersProps {
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
  categories: ModelCategory[];
  viewMode?: ViewMode;
}

export default function CategoryFilters({ 
  selectedCategories, 
  onCategoriesChange, 
  categories,
  viewMode
}: CategoryFiltersProps) {
  const allCategories = ["All", ...categories] as const;

  const handleToggle = (cat: string) => {
    if (cat === "All") {
      onCategoriesChange([]);
      return;
    }

    onCategoriesChange(
      selectedCategories.includes(cat)
        ? selectedCategories.filter(c => c !== cat)
        : [...selectedCategories, cat]
    );
  };

  const isAll = selectedCategories.length === 0;

  return (
    <div className={cn(
      "animate-fadeIn mx-auto",
      (viewMode === "Web" || viewMode === "Tab")
        ? "grid grid-cols-3 gap-x-3 gap-y-4 md:gap-x-8 lg:gap-x-12 max-w-4xl" 
        : "flex flex-wrap items-center justify-center gap-4"
    )}>
      {allCategories.map((cat) => {
        const isActive = cat === "All" ? isAll : selectedCategories.includes(cat);
        
        return (
          <button
            key={cat}
            onClick={() => handleToggle(cat)}
            className={cn(
              "relative px-4 py-2.5 group cursor-pointer flex items-center justify-center min-w-[120px]",
              viewMode === "Web" ? "px-2" : "px-4"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="activeCategory"
                className="absolute inset-0 bg-white rounded-xl shadow-[0_10px_25px_rgba(255,255,255,0.15)]"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className={cn(
              "relative z-10 text-[11px] tracking-[0.2em] uppercase font-black transition-all duration-300",
              isActive ? "text-black scale-105" : "text-white/60 group-hover:text-white"
            )}>
              {cat}
            </span>
          </button>
        );
      })}
    </div>
  );
}
