import { Smartphone, Tablet, Monitor } from "lucide-react";
import { cn } from "@/src/lib/utils";

export type ViewMode = "Phone" | "Tab" | "Web";

interface ViewSwitcherProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export default function ViewSwitcher({ currentView, onViewChange }: ViewSwitcherProps) {
  const options = [
    { id: "Phone", icon: Smartphone, label: "Phone" },
    { id: "Tab", icon: Tablet, label: "Tab" },
    { id: "Web", icon: Monitor, label: "Web" },
  ] as const;

  return (
    <div className="relative p-[1.5px] rounded-xl overflow-hidden w-fit shrink-0">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent_0_240deg,#0ea5e9_300deg,#e0f2fe_360deg)] animate-[spin_3s_linear_infinite]" />
      <div className={cn(
        "relative flex items-center justify-center gap-1 sm:gap-2 bg-black/90 dark:bg-[#111] backdrop-blur-md p-1.5 rounded-xl border border-white/5 h-full w-full",
        currentView === "Tab" ? "flex-col" : "flex-row"
      )}>
        {options.map((opt) => (
          <button
          key={opt.id}
          onClick={() => onViewChange(opt.id)}
          className={cn(
            "flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg transition-all text-[11px] sm:text-[12px] font-bold uppercase tracking-wider justify-center w-full",
            currentView === opt.id 
              ? "bg-gold text-black shadow-lg" 
              : "text-white/40 hover:text-white/80 hover:bg-white/5"
          )}
          title={opt.label}
        >
          <opt.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>{opt.label}</span>
        </button>
      ))}
      </div>
    </div>
  );
}
