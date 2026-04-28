import React, { useMemo, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Eye, TrendingUp, Sparkles, Share2, Heart, ExternalLink, MapPin, Grid, Camera, Lock, Video, ChevronLeft, ChevronRight, Star, Flame } from 'lucide-react';
import { ModelProfile } from '../../types';
import { cn } from '../../lib/utils';
import { isVideoUrl, sanitizeImageUrl } from '../../lib/imageUtils';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';

interface ModelDetailProps {
  model: ModelProfile | null;
  allModels: ModelProfile[];
  isOpen: boolean;
  onClose: () => void;
  isFavorite?: boolean;
  favorites?: string[]; // Added favorites array
  onToggleFavorite?: (id: string) => void;
  onSelectModel?: (model: ModelProfile) => void;
  onRedirect?: (model: ModelProfile, url: string) => void;
  onInteraction?: (modelId: string, updates: Partial<ModelProfile>) => void;
}

export default function ModelDetail({ 
  model, 
  allModels, 
  isOpen, 
  onClose, 
  isFavorite, 
  favorites = [], // Default to empty array
  onToggleFavorite,
  onSelectModel,
  onRedirect,
  onInteraction
}: ModelDetailProps) {
  const handleLinkClick = () => {
    if (!model || !model.socials?.instagram) return;
    
    const url = model.socials.instagram;
    
    // 1. Immediate Redirect
    if (onRedirect) {
      onRedirect(model, url);
    } else {
      window.open(url, '_blank');
    }

    // 2. Background Track
    const newClicks = (model.clicks || 0) + 1;
    onInteraction?.(model.id, { clicks: newClicks });
    
    supabase
      .from('models')
      .update({ 
        clicks: newClicks,
        recent_clicks_24h: (model.recentClicks || 0) + 1
      })
      .eq('id', model.id)
      .then(({ error }) => {
        if (error) console.error("Background click update failed:", error);
      });
  };

  const recommendations = useMemo(() => {
    if (!model || allModels.length === 0) return [];

    const adminPick = allModels.find(m => m.featured && m.id !== model.id);
    const normal = allModels.find(m => !m.featured && (m.clicks || 0) < 20 && m.id !== model.id);
    const hot = allModels.find(m => (m.clicks || 0) >= 20 && (m.clicks || 0) < 100 && m.id !== model.id);

    const result = [adminPick, normal, hot].filter(Boolean) as ModelProfile[];
    
    if (result.length < 3) {
      const remaining = allModels
        .filter(m => m.id !== model.id && !result.find(r => r.id === m.id))
        .sort(() => Math.random() - 0.5);
      
      while (result.length < 3 && remaining.length > 0) {
        result.push(remaining.pop()!);
      }
    }

    return result.slice(0, 3);
  }, [model, allModels]);

  const galleryImages = useMemo(() => {
    if (!model) return [];
    const images = [model.thumbnail, ...(model.gallery || [])]
      .filter(Boolean)
      .map(url => sanitizeImageUrl(url as string));
    return images;
  }, [model]);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [model?.id]);

  if (!model) return null;

  const currentImageUrl = galleryImages[currentImageIndex] || sanitizeImageUrl(model.thumbnail);
  const [showTeaser, setShowTeaser] = useState(false);
  const isElite = (model.clicks || 0) >= 100;
  const isTrending = (model.views || 0) >= 100;
  const isHot = (model.clicks || 0) >= 20 && (model.clicks || 0) < 100;
  const needsTeaser = model.featured || isElite || isTrending;

  const handleNextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const handlePrevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  useEffect(() => {
    if (isOpen && needsTeaser) {
      const timer = setTimeout(() => {
        setShowTeaser(true);
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setShowTeaser(false);
    }
  }, [isOpen, needsTeaser]);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12">
          {/* Backdrop with Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="relative w-full max-w-lg max-h-[90vh] bg-neutral-950 border border-white/20 rounded-[2rem] overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,1),0_0_0_1px_rgba(255,255,255,0.1)] flex flex-col z-[110]"
          >
            {/* Header / Close Button */}
            <div className="absolute top-4 right-4 z-[120]">
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/80 hover:text-white transition-all shadow-xl"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar bg-black">
              <div className="flex flex-col min-h-full">
                {/* Image / Gallery Section */}
                <div 
                  className="relative w-full aspect-[4/5] overflow-hidden bg-black/40"
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentImageIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="w-full h-full"
                    >
                      {isVideoUrl(currentImageUrl) ? (
                        <motion.video
                          src={currentImageUrl}
                          autoPlay
                          loop
                          muted
                          playsInline
                          animate={{ 
                            filter: showTeaser ? "blur(20px)" : "blur(0px)" 
                          }}
                          transition={{ 
                            filter: { duration: 1.5, ease: "easeInOut" }
                          }}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <motion.img
                          src={currentImageUrl}
                          alt={model.name}
                          animate={{ 
                            filter: showTeaser ? "blur(20px)" : "blur(0px)" 
                          }}
                          transition={{ 
                            filter: { duration: 1.5, ease: "easeInOut" }
                          }}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      )}
                    </motion.div>
                  </AnimatePresence>
                  
                  {/* Gallery Navigation UI */}
                  {galleryImages.length > 1 && !showTeaser && (
                    <>
                      <div className="absolute inset-y-0 left-0 w-1/4 z-50 cursor-pointer" onClick={handlePrevImage} />
                      <div className="absolute inset-y-0 right-0 w-1/4 z-50 cursor-pointer" onClick={handleNextImage} />
                      
                      <button 
                        onClick={handlePrevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 text-white z-50 flex items-center justify-center hover:bg-black/60 transition-all"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button 
                        onClick={handleNextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 text-white z-50 flex items-center justify-center hover:bg-black/60 transition-all"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                      
                      {/* Pagination Dots */}
                      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2 z-50 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-sm border border-white/10">
                        {galleryImages.map((_, i) => (
                          <div 
                            key={i}
                            className={cn(
                              "w-1.5 h-1.5 rounded-full transition-all duration-300",
                              i === currentImageIndex ? "bg-gold scale-125" : "bg-white/30"
                            )}
                          />
                        ))}
                      </div>
                    </>
                  )}
                  
                  {/* Teaser Overlay Detail */}
                  <AnimatePresence>
                    {showTeaser && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        className="absolute inset-0 z-40 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center p-8 text-center"
                      >
                        <motion.div 
                          animate={{ 
                            scale: [1, 1.1, 1],
                            rotate: [0, 5, -5, 0]
                          }}
                          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                          className="bg-gold p-4 rounded-full mb-6 shadow-[0_0_50px_rgba(212,175,55,0.4)]"
                        >
                          <Lock className="w-8 h-8 text-black" />
                        </motion.div>
                        <h2 className="text-white font-black text-2xl uppercase tracking-[0.2em] mb-3 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                          Locked Profile
                        </h2>
                        <p className="text-white font-bold text-xs uppercase tracking-[0.3em] mb-4 opacity-80">
                          {model.featured ? "Exclusive Admin's pick" : "Premium Member Content"}
                        </p>
                        <div className="px-6 py-2 bg-white/10 rounded-full border border-white/20 backdrop-blur-md">
                          <p className="text-white font-black text-[10px] uppercase tracking-[0.25em]">
                            Click 'Unlock Access' Below
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent opacity-90" />
                  
                  <div className="absolute bottom-6 left-6 right-6 text-left z-30">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h1 className="text-3xl font-black text-white uppercase tracking-tight italic leading-none mb-2">
                        {model.name}
                      </h1>
                      <div className="flex items-center gap-3 opacity-90">
                        <span className="flex items-center gap-1.5 px-2.5 py-1 bg-white/10 rounded-md border border-white/10 text-white text-[10px] font-black uppercase tracking-widest">
                          <MapPin className="w-3 h-3 text-gold" />
                          {model.countryName || "Global"}
                        </span>
                        <span className="text-white/40 text-xs">•</span>
                        <span className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em]">{model.displayCategory || model.category}</span>
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Info Section */}
                <div className="p-6 flex flex-col gap-6 bg-black">
                  <div className="grid grid-cols-3 gap-4 py-6 border-y border-white/5 bg-white/[0.02] rounded-2xl px-4">
                    <div className="flex flex-col items-center">
                      <div className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">Views</div>
                      <div className="text-lg font-black text-white tabular-nums flex items-center gap-2">
                        <Eye className="w-4 h-4 text-white/40" />
                        {(model.views || 0).toLocaleString()}
                      </div>
                    </div>
                    <div className="flex flex-col items-center border-x border-white/5">
                      <div className="text-[10px] font-black uppercase tracking-widest text-gold/40 mb-2">Heat</div>
                      <div className="text-lg font-black text-gold tabular-nums flex items-center gap-2">
                        <Flame className="w-4 h-4 text-gold/40" />
                        {model.heatScore}
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">Status</div>
                      <div className="text-lg font-black text-white flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs">LIVE</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <motion.button
                      onClick={handleLinkClick}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        "group relative w-full h-14 rounded-2xl flex items-center justify-center gap-3 overflow-hidden shadow-2xl transition-all",
                        model.featured 
                          ? "bg-linear-to-r from-blue-600 via-cyan-400 to-blue-500" 
                          : "bg-linear-to-r from-[#bf953f] via-[#fcf6ba] to-[#b38728]"
                      )}
                    >
                      <span className={cn(
                        "relative z-10 text-xs font-black uppercase tracking-[0.3em] italic",
                        model.featured ? "text-white" : "text-black"
                      )}>
                        {model.featured ? "ADMIN'S PICK" : "UNLOCK ACCESS"}
                      </span>
                      <ExternalLink className={cn("relative z-10 w-4 h-4", model.featured ? "text-white" : "text-black")} />
                      
                      {/* Shimmer */}
                      <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
                    </motion.button>

                    <div className="flex gap-4">
                      <button
                        onClick={() => onToggleFavorite?.(model.id)}
                        className={cn(
                          "flex-1 h-12 rounded-xl border flex items-center justify-center gap-2 transition-all font-black uppercase tracking-[0.2em] text-[10px]",
                          isFavorite 
                            ? "bg-red-500/10 border-red-500 text-red-500" 
                            : "bg-white/5 border-white/10 text-white/40 hover:text-white"
                        )}
                      >
                        <Heart className={cn("w-4 h-4", isFavorite && "fill-current")} />
                        {isFavorite ? "Saved to Profile" : "Bookmark Profile"}
                      </button>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(window.location.href);
                          toast.success("Link copied!");
                        }}
                        className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Recommendation Loop */}
                  <div className="mt-8 pt-8 border-t border-white/10">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-gold" />
                        <h3 className="text-[12px] font-black uppercase tracking-[0.4em] text-white/60">Users also unlocked</h3>
                      </div>
                      <div className="h-px flex-1 ml-4 bg-linear-to-r from-white/10 to-transparent" />
                    </div>
                    
                    <div className="flex flex-col gap-4">
                      {recommendations.map((rec) => (
                        <motion.div
                          key={rec.id}
                          whileTap={{ scale: 0.98 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectModel?.(rec);
                          }}
                          className="group relative flex items-center gap-4 p-3 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-gold/40 hover:bg-gold/5 transition-all cursor-pointer shadow-lg outline-none focus:ring-1 focus:ring-gold/50"
                        >
                          <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-white/10">
                            <img 
                              src={sanitizeImageUrl(rec.thumbnail)} 
                              alt={rec.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-[13px] font-black text-white uppercase tracking-tight truncate leading-tight italic">
                                {rec.name}
                              </h4>
                              {rec.featured && (
                                <div className="p-0.5 bg-blue-500 rounded-sm">
                                  <Star className="w-2.5 h-2.5 fill-white text-white" />
                                </div>
                              )}
                              {(rec.clicks || 0) >= 20 && (rec.clicks || 0) < 100 && (
                                <Flame className="w-3 h-3 text-gold" />
                              )}
                            </div>
                            <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-2">
                              {rec.displayCategory || rec.category} • {rec.countryName || "Global"}
                            </p>
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1 text-[8px] font-black text-gold/60 uppercase">
                                <TrendingUp className="w-3 h-3" />
                                {rec.heatScore} Impact
                              </div>
                              <div className="w-1 h-1 rounded-full bg-white/20" />
                              <div className="text-[8px] font-bold text-white/30 uppercase tracking-tighter">
                                Click to preview
                              </div>
                            </div>
                          </div>
                          
                          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:bg-gold/20 transition-all">
                            <ChevronRight className="w-4 h-4 text-gold" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
