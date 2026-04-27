import React, { useState, useEffect } from "react";
import { Search, Menu, X, User, LogOut, ShieldCheck, MousePointer2, Compass, Star, Briefcase, Heart, Eye, Instagram, Twitter, Facebook, Megaphone } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { supabase } from "@/src/lib/supabase";
import { cn } from "@/src/lib/utils";
import AdminLogin from "../admin/AdminLogin";
import { ModelProfile } from "@/src/types";

interface NavbarProps {
  onSearch: (query: string) => void;
  onDiscover: () => void;
  onTopStars: () => void;
  onFavorites: () => void;
  onSpreadTheWord?: () => void;
  activeFilter?: string;
  totalClicks?: number;
  viewMode?: string;
  models?: ModelProfile[];
}

export default function Navbar({ onSearch, onDiscover, onTopStars, onFavorites, onSpreadTheWord, activeFilter = "Discover", totalClicks = 0, viewMode = "Web", models = [] }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<any>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav className={cn(
      "sticky z-50 transition-all duration-500 mx-auto",
      isScrolled ? "top-2" : "top-4",
      viewMode === "Phone" ? "w-[calc(100%-1.5rem)] max-w-[400px]" :
      viewMode === "Tab" ? "w-[calc(100%-2rem)] max-w-[800px]" : 
      isScrolled ? "w-[calc(100%-4rem)] max-w-6xl" : "w-[calc(100%-2rem)] max-w-7xl"
    )}>
      <div className={cn(
        "glass-panel rounded-xl w-full flex transition-all duration-500",
        isScrolled ? "shadow-[0_15px_40px_-5px_rgba(0,0,0,0.4)]" : "shadow-lg",
        viewMode === "Phone" ? "flex-col p-2 gap-2" : 
        cn("items-center justify-between px-4 transition-all duration-500", isScrolled ? "h-12" : "h-14")
      )}>
        <div className={cn(
          "flex items-center min-w-0 shrink-0",
          viewMode === "Phone" ? "w-full gap-2 justify-between" : "justify-between"
        )}>
          <div className="flex items-center gap-1 overflow-x-auto [&::-webkit-scrollbar]:hidden">
            {/* Logo */}
            <div className={cn(
              "flex flex-col items-center leading-none shrink-0 cursor-pointer py-1 transition-all duration-500",
              viewMode === "Phone" ? "w-[80px] pl-1" : isScrolled ? "w-[100px] scale-90" : "w-[120px]"
            )}>
              <span className={cn("logo-monogram", viewMode === "Phone" ? "text-xl" : "text-3xl")}>DH</span>
              <div className={cn("flex items-baseline", viewMode === "Phone" ? "mt-0" : "mt-[-0.5rem]")}>
                <span className={cn("logo-desire", viewMode === "Phone" ? "text-xl" : "text-3xl")}>Desire</span>
                <span className={cn("logo-hub", viewMode === "Phone" ? "text-xs ml-1" : "text-lg ml-2")}>HUB</span>
              </div>
              <div className="flex items-center gap-1 mt-1 w-full shrink-0">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-60" />
                <span className={cn("font-black uppercase tracking-[0.4em] text-gold whitespace-nowrap opacity-90", viewMode === "Phone" ? "text-[4.5px]" : "text-[6px]")}>
                  Exclusive Directory
                </span>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-60" />
              </div>
            </div>
  
            {/* Nav Pills */}
            <nav className={cn(
              "flex items-center gap-1 p-1 rounded-full bg-black/80 border border-white/10 shrink-0",
              viewMode === "Phone" ? "" : viewMode === "Tab" ? "ml-2" : "ml-4 xl:ml-12"
            )}>
              {[
                { id: "Discover", label: "Discover", icon: Compass, onClick: onDiscover },
                { id: "TopStars", label: "Top Stars", icon: Star, onClick: onTopStars },
                { id: "Favorites", label: "Bookmarked", icon: Heart, onClick: onFavorites },
                { id: "Promote", label: "Promote", icon: Megaphone, onClick: onSpreadTheWord || (() => {}) },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    item.onClick();
                    setIsMenuOpen(false);
                  }}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 rounded-full transition-all duration-300",
                    activeFilter === item.id ? "bg-white/10 text-white shadow-inner scale-105" : "text-white/60 hover:text-white hover:bg-white/5",
                    viewMode === "Phone" && "px-2"
                  )}
                  title={item.label}
                >
                  <item.icon className={cn(
                    "w-4 h-4 transition-colors shrink-0", 
                    activeFilter === item.id ? (item.id === "Favorites" ? "text-red-500 fill-red-500" : "text-gold fill-gold/20") : ""
                  )} />
                  <span className={cn(
                    "uppercase tracking-[0.15em] font-black hidden md:block whitespace-nowrap",
                    viewMode === "Tab" ? "text-[10px]" : "text-[11px]"
                  )}>
                    {item.label}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* Mobile Total Views Counter (Visible only in top right in Phone mode) */}
          {viewMode === "Phone" && (
            <div className="flex flex-col items-end leading-tight shrink-0 pl-2 pr-1 ml-auto">
              <div className="font-bold text-white flex items-center gap-1 text-[10px]">
                <Eye className="text-gold w-3 h-3" />
                {totalClicks.toLocaleString()}
              </div>
              <div className="opacity-60 font-black tracking-[0.1em] text-[7px]">TOTAL VIEWS</div>
            </div>
          )}
        </div>

        {/* Search Bar & Actions Container */}
        <div className={cn(
          "flex items-center",
          viewMode === "Phone" ? "w-full gap-2 justify-between" : "flex-1 justify-end shrink-0"
        )}>
          {/* Search Bar */}
          <div className={cn(
            "flex-1 min-w-[120px]",
            viewMode === "Phone" ? "block w-full" : "hidden sm:block",
            viewMode === "Tab" ? "mx-2 max-w-[200px]" : "mx-2 xl:mx-8 max-w-md"
          )}>
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40 group-focus-within:opacity-100 transition-opacity" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearch}
                className={cn(
                  "w-full pl-8 xl:pl-10 pr-2 xl:pr-4 rounded-xl text-xs sm:text-sm outline-none transition-all glass-panel bg-transparent border-black/10 dark:border-white/10 focus:border-accent/40 focus:ring-2 focus:ring-accent/10 placeholder:opacity-30",
                  isScrolled ? "py-1.5" : "py-2"
                )}
              />
            </div>
          </div>

          {/* Actions */}
          <div className={cn("flex items-center transition-all duration-500", isScrolled ? "gap-2" : "gap-4")}>
            <div className={cn(
              "flex items-center border-black/10 dark:border-white/10 transition-all duration-500",
              isScrolled ? "gap-2" : "gap-3",
              viewMode === "Phone" ? "pl-2 border-l" : isScrolled ? "pl-2 border-l" : "pl-4 border-l"
            )}>
              {/* Public Views Counter */}
              <div className={cn(
                "text-right leading-tight pr-2 sm:pr-3 border-r border-black/10 dark:border-white/10 hidden sm:block"
              )}>
                <div className={cn(
                  "font-bold text-white flex items-center gap-1 justify-end transition-all duration-500",
                  isScrolled ? "text-[10px]" : "text-xs"
                )}>
                  <Eye className={cn("text-gold transition-all", isScrolled ? "w-2.5 h-2.5" : "w-3 h-3")} />
                  {totalClicks.toLocaleString()}
                </div>
                <div className={cn("opacity-60 font-black tracking-[0.1em] transition-all", isScrolled ? "text-[7px]" : "text-[9px]")}>TOTAL VIEWS</div>
              </div>

              {user ? (
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "text-right leading-tight",
                    viewMode === "Phone" ? "hidden" : "hidden sm:block"
                  )}>
                    <div className={cn(
                      "font-bold text-gold-gradient flex items-center gap-1 justify-end transition-all duration-500",
                      isScrolled ? "text-[10px]" : "text-xs"
                    )}>
                      <ShieldCheck className={cn("transition-all", isScrolled ? "w-2.5 h-2.5" : "w-3 h-3")} />
                      ADMIN ACCESS
                    </div>
                    <div className={cn("opacity-40 font-mono transition-all truncate max-w-[100px]", isScrolled ? "text-[8px]" : "text-[10px]")}>{user.email}</div>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className={cn("rounded-full hover:bg-red-500/10 text-red-500 transition-colors", viewMode === "Phone" ? "p-1" : "p-2")}
                    title="Sign Out"
                  >
                    <LogOut className={cn(viewMode === "Phone" ? "w-4 h-4" : "w-5 h-5")} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className={cn(
                    "text-right leading-tight group-hover:opacity-100 transition-opacity",
                    viewMode === "Phone" ? "hidden" : "hidden sm:block"
                  )}>
                    <button onClick={() => setIsLoginOpen(true)} className="font-semibold opacity-60 hover:text-gold transition-colors block ml-auto">Admin Login</button>
                    <div className="opacity-30 font-mono text-[9px] mb-1">AUTHORIZED ONLY</div>
                  </div>
                  <button 
                    onClick={() => setIsLoginOpen(true)}
                    className={cn(
                      "glass-panel rounded-full flex items-center justify-center hover:bg-gold/10 transition-colors border-white/10 shrink-0 group",
                      viewMode === "Phone" ? "h-8 w-8" : "h-10 w-10"
                    )}
                  >
                    <ShieldCheck className={cn("opacity-40 group-hover:opacity-100 group-hover:text-gold transition-all", viewMode === "Phone" ? "w-4 h-4" : "w-5 h-5")} />
                  </button>
                </div>
              )}
            </div>

            <button 
              className={cn(
                "p-2 rounded-full transition-colors hover:bg-black/5 dark:hover:bg-white/10",
                viewMode === "Phone" ? "hidden" : "md:hidden"
              )}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              title={isMenuOpen ? "Close Menu" : "Open Menu"}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      <AdminLogin 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)}
        onSuccess={() => setIsLoginOpen(false)}
      />

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t bg-inherit"
          >
            <div className="p-4 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search models..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/5 dark:bg-white/5 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => { onDiscover(); setIsMenuOpen(false); }} className="p-4 text-center rounded-xl bg-black/5 dark:bg-white/5 font-medium hover:bg-black/10 transition-colors">Discover</button>
                <button onClick={() => { onTopStars(); setIsMenuOpen(false); }} className="p-4 text-center rounded-xl bg-black/5 dark:bg-white/5 font-medium hover:bg-black/10 transition-colors">Popular</button>
                <button onClick={() => { onFavorites(); setIsMenuOpen(false); }} className="p-4 text-center rounded-xl bg-black/5 dark:bg-white/5 font-medium hover:bg-black/10 transition-colors">Favorites</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
