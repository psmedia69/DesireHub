import { useState, useEffect, useMemo, useRef } from "react";
import Navbar from "./components/layout/Navbar";
import CategoryFilters from "./components/filters/CategoryFilters";
import SortingFilters from "./components/filters/SortingFilters";
import ViewSwitcher, { ViewMode } from "./components/layout/ViewSwitcher";
import ModelCard from "./components/gallery/ModelCard";
import ModelSkeleton from "./components/gallery/ModelSkeleton";
import AdminPanel from "./components/admin/AdminPanel";
import EditModelModal from "./components/admin/EditModelModal";
import TrendingSection from "./components/gallery/TrendingSection";
import ModelDetail from "./components/gallery/ModelDetail";
import PromotionBanner from "./components/layout/PromotionBanner";
import SensualBanner from "./components/layout/SensualBanner";
import SpreadTheWordModal from "./components/layout/SpreadTheWordModal";
import AgeVerification from "./components/layout/AgeVerification";
import { ViewModePopup } from "./components/layout/ViewModePopup";
import RedirectScreen from "./components/layout/RedirectScreen";
import BackToTop from "./components/ui/BackToTop";
import { ModelProfile, ModelCategory, SortOption } from "./types";
import { motion, AnimatePresence } from "motion/react";
import { MousePointer2, Compass, Star, Heart, Sparkles, Instagram, Twitter, Facebook } from "lucide-react";
import { cn } from "./lib/utils";
import { supabase } from "./lib/supabase";
import { Toaster, toast } from 'sonner';

const CATEGORIES: ModelCategory[] = ["DESI", "Latina", "White", "Arab", "Asian"];

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [countryFilter, setCountryFilter] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("Web");
  const [isAgeVerified, setIsAgeVerified] = useState(false);
  const [isModeSelected, setIsModeSelected] = useState(false);
  const [isSpreadTheWordOpen, setIsSpreadTheWordOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [editingModel, setEditingModel] = useState<ModelProfile | null>(null);
  const [selectedModelForDetail, setSelectedModelForDetail] = useState<ModelProfile | null>(null);
  const [redirectingModel, setRedirectingModel] = useState<ModelProfile | null>(null);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const [redirectDuration, setRedirectDuration] = useState(3000);
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [activeFilter, setActiveFilter] = useState<string>("Discover");
  const [isLoading, setIsLoading] = useState(true);
  const [randomSeed, setRandomSeed] = useState(0);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('modelFavorites') || '[]'); }
    catch { return []; }
  });

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const isFavorited = prev.includes(id);
      const next = isFavorited ? prev.filter(f => f !== id) : [...prev, id];
      localStorage.setItem('modelFavorites', JSON.stringify(next));
      
      if (isFavorited) {
        toast('Removed from favorites', { icon: '💔' });
      } else {
        toast.success('Added to favorites', { icon: '❤️' });
      }
      
      return next;
    });
  };

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const [supabaseModels, setSupabaseModels] = useState<ModelProfile[]>([]);
  const [trendingModels, setTrendingModels] = useState<ModelProfile[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const PAGE_SIZE = 12;

  const fetchTrendingModels = async () => {
    try {
      const { data, error } = await supabase
        .from('models')
        .select('*')
        .order('clicks', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      
      if (data) {
        const mappedData: ModelProfile[] = data.map(item => ({
          id: item.id.toString(),
          name: item.name,
          category: Array.isArray(item.category) ? item.category[0] : String(item.category).replace(/[\[\]"]/g, ''),
          bio: item.bio || "", 
          thumbnail: item.image,
          gallery: Array.isArray(item.gallery) ? item.gallery : [],
          socials: { instagram: item.link }, 
          clicks: item.clicks || 0,
          views: item.views || 0,
          recentClicks: item.recent_clicks_24h || 0,
          featured: item.featured || false,
          heatScore: (item.clicks || 0) * 2 + (item.views || 0) + (item.recent_clicks_24h || 0) * 3,
          countryName: item.country_name,
          displayCategory: item.display_category,
          followersCount: item.followers_count,
          createdAt: item.created_at,
        }));
        setTrendingModels(mappedData);
      }
    } catch (err) {
      console.warn('Could not fetch trending models:', err);
    }
  };

  useEffect(() => {
    fetchTrendingModels();
  }, []);

  const fetchSupabaseModels = async (reset = false) => {
    if (reset) {
      setIsLoading(true);
      setPage(0);
      setHasMore(true);
    } else {
      if (!hasMore || isFetchingMore) return;
      setIsFetchingMore(true);
    }

    try {
      const currentPage = reset ? 0 : page;
      const from = currentPage * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      let query = supabase
        .from('models')
        .select('*', { count: 'exact' });

      // Apply server-side filters
      if (searchQuery) {
        query = query.ilike('name', `%${searchQuery}%`);
      }

      if (countryFilter) {
        query = query.ilike('country_name', `%${countryFilter}%`);
      }

      if (selectedCategories.length > 0) {
        // If it's a JSON array column, we might need a different approach,
        // but assuming it's filterable by text or matching typical categories
        query = query.or(selectedCategories.map(cat => `category.ilike.%${cat}%`).join(','));
      }

      // Apply specific filters based on activeFilter
      if (activeFilter === "TopStars") {
        query = query.or('featured.eq.true,clicks.gt.50');
      }

      // Special case for Favorites: if it's the active filter, we filter by IDs
      if (activeFilter === "Favorites" && favorites.length > 0) {
        query = query.in('id', favorites);
      } else if (activeFilter === "Favorites" && favorites.length === 0) {
        // Return empty if no favorites and filtered by favorites
        setSupabaseModels([]);
        setHasMore(false);
        setIsLoading(false);
        return;
      }

      // Apply sorting
      switch (sortOption) {
        case "name-asc": query = query.order('name', { ascending: true }); break;
        case "name-desc": query = query.order('name', { ascending: false }); break;
        case "popular": query = query.order('clicks', { ascending: false }); break;
        case "oldest": query = query.order('created_at', { ascending: true }); break;
        case "random": 
          // Database random sort is hard with Supabase without an RPC, 
          // so we'll keep random sorting partially client-side or use created_at as backup
          query = query.order('created_at', { ascending: false });
          break;
        case "newest": 
        default: 
          query = query.order('created_at', { ascending: false });
          break;
      }

      const { data, error, count } = await query.range(from, to);
      
      if (error) throw error;
      
      if (data) {
        const mappedData: ModelProfile[] = data.map(item => ({
          id: item.id.toString(),
          name: item.name,
          category: Array.isArray(item.category) ? item.category[0] : String(item.category).replace(/[\[\]"]/g, ''),
          bio: item.bio || "", 
          thumbnail: item.image,
          gallery: Array.isArray(item.gallery) ? item.gallery : [],
          socials: { instagram: item.link }, 
          clicks: item.clicks || 0,
          views: item.views || 0,
          recentClicks: item.recent_clicks_24h || 0,
          featured: item.featured || false,
          heatScore: (item.clicks || 0) * 2 + (item.views || 0) + (item.recent_clicks_24h || 0) * 3,
          countryName: item.country_name,
          displayCategory: item.display_category,
          followersCount: item.followers_count,
          createdAt: item.created_at,
        }));

        if (reset) {
          setSupabaseModels(mappedData);
        } else {
          setSupabaseModels(prev => {
            const existingIds = new Set(prev.map(m => m.id));
            const uniqueNew = mappedData.filter(m => !existingIds.has(m.id));
            return [...prev, ...uniqueNew];
          });
        }

        if (count !== null && (from + mappedData.length >= count)) {
          setHasMore(false);
        } else if (mappedData.length < PAGE_SIZE) {
          setHasMore(false);
        } else {
          setPage(currentPage + 1);
        }
      }
    } catch (err) {
      console.warn('Could not fetch models from Supabase:', err);
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  };

  useEffect(() => {
    fetchSupabaseModels(true);
  }, [searchQuery, selectedCategories, countryFilter, activeFilter, sortOption, favorites]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading && !isFetchingMore) {
          fetchSupabaseModels();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoading, isFetchingMore]);

  const filteredModels = useMemo(() => {
    if (sortOption === "random") {
      return [...supabaseModels].sort((a, b) => {
        // Improved pseudo-random sort that handles non-numeric IDs (like UUIDs)
        const strHash = (s: string) => {
          let h = 0;
          for (let i = 0; i < s.length; i++) h = Math.imul(31, h) + s.charCodeAt(i) | 0;
          return h;
        };
        const valA = Math.sin(strHash(a.id) + randomSeed) * 10000;
        const valB = Math.sin(strHash(b.id) + randomSeed) * 10000;
        return (valA % 1) - (valB % 1);
      });
    }

    // Default or Popular sorting uses alternating New and Hot logic
    if (sortOption === "newest" || sortOption === "popular") {
      const now = new Date().getTime();
      const NEW_WINDOW = 86400000; // 24 hours

      // Pool A: New models (within 18 hours), sorted by newest first
      const poolA = [...supabaseModels].filter(m => 
        m.createdAt && (now - new Date(m.createdAt).getTime() < NEW_WINDOW)
      ).sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());

      // Pool B: Hot models (older than 18 hours), sorted by heatScore
      const poolB = [...supabaseModels].filter(m => 
        !m.createdAt || (now - new Date(m.createdAt).getTime() >= NEW_WINDOW)
      ).sort((a, b) => (b.heatScore || 0) - (a.heatScore || 0));

      const mixed: ModelProfile[] = [];
      const maxLength = Math.max(poolA.length, poolB.length);

      for (let i = 0; i < maxLength; i++) {
        // High priority: Alternate New and Hot
        if (i < poolA.length) mixed.push(poolA[i]);
        if (i < poolB.length) mixed.push(poolB[i]);
      }

      return mixed;
    }

    // Fallback for other sort options (respect featured models at top)
    return [...supabaseModels].sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });
  }, [supabaseModels, sortOption, randomSeed]);

  const shuffledModels = useMemo(() => {
    return [...supabaseModels].sort(() => 0.5 - Math.random());
  }, [supabaseModels, randomSeed]);

  const handleDiscover = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setCountryFilter(null);
    setSortOption("newest");
    setActiveFilter("Discover");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleTopStars = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setCountryFilter(null);
    setSortOption("popular");
    setActiveFilter("TopStars");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFavorites = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setCountryFilter(null);
    setSortOption("newest");
    setActiveFilter("Favorites");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle individual model updates from cards
  const handleModelUpdate = (modelId: string, updates: Partial<ModelProfile>) => {
    setSupabaseModels(prev => 
      prev.map(m => m.id === modelId ? { ...m, ...updates } : m)
    );
  };

  const totalClicks = useMemo(() => supabaseModels.reduce((acc, model) => acc + (model.views || 0), 0), [supabaseModels]);

  const [isShuffling, setIsShuffling] = useState(false);

  const handleSurpriseMe = () => {
    setIsShuffling(true);
    setSortOption("random");
    // Use a large random multiplier to ensure Sin produces a very different result each time
    setRandomSeed(Math.random() * 1000);
    
    setTimeout(() => {
      setIsShuffling(false);
      toast.success('System randomized! Enjoy the discovery 🥵', { icon: '🎲' });
      // Removed auto-scroll as requested to stay in the posts area
    }, 800);
  };

  const handleRedirect = useMemo(() => (model: ModelProfile, url: string) => {
    setRedirectingModel(model);
    setRedirectUrl(url);
    setRedirectDuration(2000);
  }, []);

  const handleRedirectComplete = useMemo(() => () => {
    if (redirectUrl) {
      window.open(redirectUrl, '_blank');
      setRedirectingModel(null);
      setRedirectUrl(null);
    }
  }, [redirectUrl]);

  const handleRedirectCancel = useMemo(() => () => {
    setRedirectingModel(null);
    setRedirectUrl(null);
  }, []);

  return (
    <div className="relative min-h-screen selection:bg-gold/30 overflow-x-hidden">
      <AgeVerification onVerify={() => setIsAgeVerified(true)} />
      
      {isAgeVerified && !isModeSelected && (
        <ViewModePopup onSelect={(mode) => {
          setViewMode(mode);
          setIsModeSelected(true);
          toast.success(`Mode set to ${mode}`, { icon: '🚀' });
        }} />
      )}
      
      <Toaster theme="dark" position="bottom-center" toastOptions={{ className: 'bg-black/95 border border-gold/20 text-white font-bold px-6 py-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]' }} />
      
      <main className={cn(
        "relative mx-auto z-10 transition-all duration-700",
        !isModeSelected && "hidden",
        viewMode === "Phone" ? "max-w-[400px] bg-black/40 ring-8 ring-black/80 rounded-[3.5rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] my-8 pb-20 overflow-hidden" : 
        viewMode === "Tab" ? "max-w-[800px] bg-black/10 rounded-[2rem] shadow-2xl my-4 pb-20 overflow-hidden" : 
        "max-w-7xl pb-20"
      )}>
        <Navbar 
          onSearch={setSearchQuery} 
          onDiscover={handleDiscover}
          onTopStars={handleTopStars}
          onFavorites={handleFavorites}
          onSpreadTheWord={() => setIsSpreadTheWordOpen(true)}
          activeFilter={activeFilter}
          totalClicks={totalClicks}
          viewMode={viewMode}
        />
        
        <div className={cn(
          viewMode === "Phone" ? "px-6 pt-4" : viewMode === "Tab" ? "px-8 pt-28" : "px-6 pt-28"
        )}>
          {/* Social Links - Simplified and enlarged after TG button removal */}
          {viewMode === "Phone" && (
            <div className="flex items-center justify-center w-full mb-8 z-20">
              <div className="relative rounded-[2rem] overflow-hidden group w-full border border-gold/30 shadow-[0_0_30px_rgba(212,175,55,0.15)]">
                <div className="relative bg-black/90 px-8 py-5 flex items-center justify-between h-full backdrop-blur-[26.4px]">
                  <a href="https://www.instagram.com/desirefactoryhub/" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-gold transition-all hover:scale-125 active:scale-90 relative z-10" title="Instagram"><Instagram className="w-8 h-8" /></a>
                  <a href="https://www.reddit.com/user/Virtual_Dream_6074/" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-[#FF4500] transition-all hover:scale-125 active:scale-90 relative z-10" title="Reddit">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8"><path d="M22 11.5c0-1.38-1.12-2.5-2.5-2.5-.72 0-1.37.31-1.83.8-1.46-1.07-3.44-1.76-5.63-1.84l1.2-5.65 3.93.84c.05 1.25 1.09 2.25 2.36 2.25 1.31 0 2.37-1.06 2.37-2.37C21.9 4.22 20.84 3.16 19.53 3.16c-1.05 0-1.95.69-2.26 1.63L12.8 3.82c-.17-.04-.34.07-.38.24L11.08 10.3c-2.2.06-4.18.75-5.65 1.83-.45-.49-1.1-.8-1.83-.8-1.38 0-2.5 1.12-2.5 2.5 0 .91.5 1.7 1.22 2.14-.04.22-.06.45-.06.69 0 3.59 4.39 6.5 9.8 6.5s9.8-2.91 9.8-6.5c0-.24-.02-.47-.06-.69.72-.44 1.22-1.23 1.22-2.14zM9 14.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5S9 15.33 9 14.5zm7 3.5c-1.36.91-3.16 1.15-4 1.15-.84 0-2.64-.24-4-1.15-.22-.15-.28-.45-.13-.67.15-.22.45-.28.67-.13 1.1.74 2.55.95 3.46.95.91 0 2.36-.21 3.46-.95.22-.15.52-.09.67.13.15.22.09.52-.13.67zM15 16c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>
                  </a>
                  <a href="https://x.com/Ps2022_24" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-all hover:scale-125 active:scale-90 relative z-10" title="X (Twitter)"><Twitter className="w-8 h-8" /></a>
                  <a href="https://www.facebook.com/profile.php?id=61580298511422" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-[#1877F2] transition-all hover:scale-125 active:scale-90 relative z-10" title="Facebook"><Facebook className="w-8 h-8" /></a>
                </div>
              </div>
            </div>
          )}

          {user && (
          <AdminPanel onModelAdded={() => {
            fetchSupabaseModels(true);
            fetchTrendingModels();
          }} models={supabaseModels} />
        )}


        <TrendingSection 
          models={trendingModels} 
          onCardClick={(m) => setSelectedModelForDetail(m)} 
          viewMode={viewMode}
        />

        <SensualBanner viewMode={viewMode} />

        {/* Filters and Search Area */}
        <div className="flex flex-col gap-8 mb-16 px-2">
          {/* Category Filters Row - Locked on top */}
          <div className="flex justify-center w-full">
            <CategoryFilters 
              selectedCategories={selectedCategories} 
              onCategoriesChange={setSelectedCategories} 
              categories={CATEGORIES}
              viewMode={viewMode}
            />
          </div>

          {/* Sub-Filters Row: Surprise & Sorting */}
          <div className={cn(
            "flex items-center justify-between gap-6 w-full",
            viewMode === "Phone" ? "flex-col" : "flex-row"
          )}>
            <div className={cn(
              "flex-1 w-full sm:w-auto",
              viewMode === "Phone" ? "hidden" : "flex justify-start"
            )}>
              {/* Surprise Button for Web and Tab mode */}
              {(viewMode === "Web" || viewMode === "Tab") && (
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative rounded-[10px] overflow-hidden shrink-0 group border border-orange-400/50"
                >
                  <button
                    onClick={handleSurpriseMe}
                    disabled={isShuffling}
                    className="relative bg-[#fefce8] text-black/80 w-full h-full text-[11px] font-black uppercase tracking-[0.3em] shadow-[0_10px_30px_-5px_rgba(255,255,255,0.1)] hover:bg-[#fef9c3] transition-all flex items-center justify-center gap-3 disabled:opacity-50 px-8 py-3"
                  >
                    <motion.span 
                      animate={isShuffling ? { rotate: 360 } : {}}
                      transition={isShuffling ? { duration: 0.5, repeat: Infinity, ease: "linear" } : {}}
                      className="group-hover:rotate-180 transition-transform duration-700 text-base"
                    >
                      🍑
                    </motion.span>
                    {isShuffling ? "Shuffling..." : "🍑 Unlock Random Profile 🥵"}
                  </button>
                </motion.div>
              )}
            </div>

            <div className={cn(
              "flex-1 flex flex-col gap-3 w-full sm:w-auto",
              viewMode !== "Phone" ? "items-end" : "items-center"
            )}>
              <SortingFilters 
                sortBy={sortOption}
                onSortChange={setSortOption}
              />
              {viewMode === "Phone" && (
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative rounded-[10px] overflow-hidden shrink-0 group border border-orange-400/50"
                >
                  <button
                    onClick={handleSurpriseMe}
                    disabled={isShuffling}
                    className="relative bg-[#fefce8] text-black/80 w-full h-full text-[11px] font-black uppercase tracking-[0.3em] shadow-[0_10px_30px_-5px_rgba(255,255,255,0.1)] hover:bg-[#fef9c3] transition-all flex items-center justify-center gap-3 disabled:opacity-50 px-8 py-3"
                  >
                    <motion.span 
                      animate={isShuffling ? { rotate: 360 } : {}}
                      transition={isShuffling ? { duration: 0.5, repeat: Infinity, ease: "linear" } : {}}
                      className="group-hover:rotate-180 transition-transform duration-700 text-base"
                    >
                      🍑
                    </motion.span>
                    {isShuffling ? "Shuffling..." : "🍑 Unlock Random Profile 🥵"}
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Active Filter Chips */}
        <AnimatePresence>
          {(selectedCategories.length > 0 || searchQuery || countryFilter) && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-wrap items-center gap-3 mb-8 px-2"
            >
              <div className="text-[10px] uppercase tracking-widest font-black text-white/30 mr-2">Active Filters:</div>
              
              {searchQuery && (
                <motion.div 
                  layout
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-white uppercase tracking-wider"
                >
                  Search: {searchQuery}
                  <button onClick={() => setSearchQuery("")} className="hover:text-gold transition-colors">
                    <span className="text-xs">✕</span>
                  </button>
                </motion.div>
              )}

              {countryFilter && (
                <motion.div 
                  layout
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/40 text-[10px] font-bold text-blue-400 uppercase tracking-wider"
                >
                  Country: {countryFilter}
                  <button onClick={() => setCountryFilter(null)} className="hover:text-white transition-colors">
                    <span className="text-xs">✕</span>
                  </button>
                </motion.div>
              )}

              {selectedCategories.map(cat => (
                <motion.div 
                  key={cat}
                  layout
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/10 border border-gold/40 text-[10px] font-bold text-gold uppercase tracking-wider shadow-[0_0_15px_rgba(212,175,55,0.1)]"
                >
                  {cat}
                  <button 
                    onClick={() => setSelectedCategories(prev => prev.filter(c => c !== cat))} 
                    className="hover:text-white transition-colors"
                  >
                    <span className="text-xs">✕</span>
                  </button>
                </motion.div>
              ))}

              <motion.button
                layout
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedCategories([]);
                  setSearchQuery("");
                }}
                className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors ml-2 underline underline-offset-4 decoration-gold/40"
              >
                Clear All
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-4 mb-10 px-2 overflow-hidden">
          <div className="h-px bg-linear-to-r from-gold/50 via-gold/10 to-transparent flex-1" />
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-gold animate-pulse" />
            <h2 className="text-white text-[12px] font-black uppercase tracking-[0.5em] whitespace-nowrap">Directory Listing</h2>
          </div>
          <div className="h-px bg-linear-to-l from-gold/50 via-gold/10 to-transparent flex-1" />
          <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Curated Selection</span>
        </div>

        <motion.div 
          layout={viewMode !== "Phone"}
          className={cn(
            "grid gap-8 transition-all duration-300",
            viewMode === "Phone" ? "grid-cols-1" : 
            viewMode === "Tab" ? "grid-cols-3" : 
            "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
          )}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {isLoading ? (
              Array.from({ length: viewMode === "Phone" ? 4 : PAGE_SIZE }).map((_, i) => (
                <motion.div
                  key={`skeleton-${i}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <ModelSkeleton />
                </motion.div>
              ))
            ) : filteredModels.length === 0 ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="col-span-full py-32 text-center glass-premium rounded-3xl"
              >
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
                  <Compass className="w-8 h-8 text-white/20 animate-spin-slow" />
                </div>
                <h3 className="text-white text-xl font-bold mb-2">No models found</h3>
                <p className="text-white/40 text-sm">Try broadening your search or selection.</p>
              </motion.div>
            ) : (
              filteredModels.map((model, idx) => (
                <motion.div
                  key={model.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ 
                    duration: 0.3, 
                    delay: idx * 0.02,
                    ease: "easeOut"
                  }}
                >
                  <ModelCard 
                    model={model} 
                    isAdmin={!!user} 
                    onEdit={(m) => setEditingModel(m)}
                    onDeleteSuccess={fetchSupabaseModels}
                    isFavorite={favorites.includes(model.id)}
                    onToggleFavorite={toggleFavorite}
                    onInteraction={(updates) => handleModelUpdate(model.id, updates)}
                    onCardClick={(m) => setSelectedModelForDetail(m)}
                    onCountryClick={(country) => {
                      setCountryFilter(country);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                      toast.success(`Filtering by ${country}`, { icon: '🌍' });
                    }}
                    onRedirect={handleRedirect}
                  />
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </motion.div>

        {/* Intersection Observer Anchor */}
        <div ref={loadMoreRef} className="h-20 w-full flex items-center justify-center mt-10">
          {isFetchingMore && (
            <div className="flex items-center gap-3">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-gold/30 border-t-gold rounded-full"
              />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Loading More Content...</span>
            </div>
          )}
          {!hasMore && filteredModels.length > 0 && (
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
              End of Directory
            </div>
          )}
        </div>

        {/* Recommended For You Section */}
        {filteredModels.length > 0 && (
          <div className="mt-16 w-full relative z-10">
            <div className="flex items-center gap-4 mb-8 px-2 max-w-7xl mx-auto">
              <div className="relative">
                <div className="absolute inset-0 bg-gold blur-md opacity-40 animate-pulse" />
                <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-black border border-gold/30">
                  <Star className="w-5 h-5 text-gold" />
                </div>
              </div>
              <div>
                <h2 className="text-white text-base font-black uppercase tracking-[0.4em] leading-none">Recommended For You</h2>
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="h-[2px] w-12 bg-linear-to-r from-gold to-transparent rounded-full shadow-[0_0_15px_rgba(212,175,55,0.8)]" />
                  <span className="text-[10px] font-bold text-gold/60 uppercase tracking-widest">You May Also Like</span>
                </div>
              </div>
            </div>
            <div className={cn(
              "grid gap-8 transition-all duration-500 max-w-7xl mx-auto",
              viewMode === "Phone" ? "grid-cols-1" : 
              viewMode === "Tab" ? "grid-cols-3" : 
              "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
            )}>
              {(() => {
                const recommended = shuffledModels.slice(0, 4);
                return recommended.map((model) => (
                  <motion.div key={`rec-${model.id}`}>
                    <ModelCard 
                      model={model}
                      isAdmin={!!user}
                      onEdit={setEditingModel}
                      onDeleteSuccess={fetchSupabaseModels}
                      isFavorite={favorites.includes(model.id)}
                      onToggleFavorite={toggleFavorite}
                      onCardClick={setSelectedModelForDetail}
                      onCountryClick={(country) => {
                        setCountryFilter(country);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                        toast.success(`Filtering by ${country}`, { icon: '🌍' });
                      }}
                      onRedirect={handleRedirect}
                    />
                  </motion.div>
                ));
              })()}
            </div>
          </div>
        )}

        {editingModel && (
          <EditModelModal 
            isOpen={!!editingModel}
            model={editingModel}
            onClose={() => setEditingModel(null)}
            onSuccess={fetchSupabaseModels}
          />
        )}

        <ModelDetail
          model={selectedModelForDetail}
          allModels={supabaseModels}
          isOpen={!!selectedModelForDetail}
          onClose={() => setSelectedModelForDetail(null)}
          onSelectModel={setSelectedModelForDetail}
          onInteraction={handleModelUpdate}
          onRedirect={handleRedirect}
          isFavorite={selectedModelForDetail ? favorites.includes(selectedModelForDetail.id) : false}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
        />

        <RedirectScreen
          model={redirectingModel}
          isOpen={!!redirectingModel}
          duration={redirectDuration}
          onComplete={handleRedirectComplete}
          onCancel={handleRedirectCancel}
        />

        <BackToTop />
        <SpreadTheWordModal 
          isOpen={isSpreadTheWordOpen} 
          onClose={() => setIsSpreadTheWordOpen(false)} 
        />
        </div>
      </main>

      <footer className="relative py-16 border-t border-black/5 dark:border-white/5 glass-premium z-10 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="flex flex-col items-center leading-none mb-4">
              <span className="logo-monogram text-6xl">DH</span>
              <div className="flex items-baseline mt-[-0.8rem]">
                <span className="logo-desire text-5xl">Desire</span>
                <span className="logo-hub text-4xl ml-3">HUB</span>
              </div>
              <div className="flex items-center gap-4 mt-3 w-full max-w-md">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-40" />
                <div className="flex items-center gap-2">
                  <MousePointer2 className="w-2 h-2 text-gold fill-gold opacity-60" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-gold whitespace-nowrap opacity-80">
                    Your Desires, Our Priority
                  </span>
                  <MousePointer2 className="w-2 h-2 text-gold fill-gold opacity-60" />
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-40" />
              </div>
            </div>
          </div>
          <p className="text-sm opacity-50 max-w-md mx-auto leading-relaxed">
            Exclusive model and influencer directory. Connect with the best in the industry.
          </p>
          <div className="mt-8 pt-8 border-t border-black/5 dark:border-white/5 text-[10px] uppercase tracking-[0.2em] font-bold opacity-20">
            © 2026 DESIRE HUB INTERNATIONAL. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
