import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Eye, TrendingUp, Sparkles, Share2, Heart, ExternalLink, MapPin, Grid, Camera } from 'lucide-react';
import { ModelProfile } from '../../types';
import { cn } from '../../lib/utils';
import { isVideoUrl, sanitizeImageUrl } from '../../lib/imageUtils';
import ModelCard from './ModelCard';
import { supabase } from '@/src/lib/supabase';
import ImageLightbox from './ImageLightbox';

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
  const [lightboxIndex, setLightboxIndex] = useState(-1);

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

  const relatedModels = useMemo(() => {
    if (!model) return [];
    return allModels
      .filter(m => m.category === model.category && m.id !== model.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);
  }, [model, allModels]);

  const galleryImages = useMemo(() => {
    if (!model) return [];
    return [model.thumbnail, ...(model.gallery || [])]
      .filter(Boolean)
      .map(url => sanitizeImageUrl(url as string));
  }, [model]);

  if (!model) return null;

  const thumbnail = sanitizeImageUrl(model.thumbnail);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12">
          {/* Backdrop with Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90"
          />

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-sm max-h-[80vh] bg-[#0a0a0a] border border-white/10 rounded-[1.5rem] overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,1)] flex flex-col"
          >
            {/* Header / Close Button */}
            <div className="absolute top-2 right-2 z-50">
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-6 h-6 rounded-full bg-black/80 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all"
              >
                <X className="w-3 h-3" />
              </motion.button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="flex flex-col min-h-full">
                {/* Image Section */}
                <div 
                  className="relative w-full aspect-square overflow-hidden cursor-zoom-in group"
                  onClick={() => setLightboxIndex(0)}
                >
                  {isVideoUrl(thumbnail) ? (
                    <video
                      src={thumbnail}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover transition-transform duration-700"
                    />
                  ) : (
                    <img
                      src={thumbnail}
                      alt={model.name}
                      className="w-full h-full object-cover transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0a] via-transparent to-transparent opacity-80" />
                  
                  <div className="absolute bottom-3 left-3 right-3 text-left">
                    <h1 className="text-xl font-black text-white uppercase tracking-tighter italic leading-tight">
                      {model.name}
                    </h1>
                    <div className="flex items-center gap-2 mt-1 opacity-80">
                      <span className="text-white/60 text-[8px] font-black uppercase tracking-widest">{model.countryName || "Global"}</span>
                      <span className="text-white/20 text-[8px]">•</span>
                      <span className="text-white/60 text-[8px] font-black uppercase tracking-widest">{model.displayCategory || model.category}</span>
                      <span className="text-white/20 text-[8px]">•</span>
                      <span className="text-white/60 text-[8px] font-black uppercase tracking-widest">{model.followersCount || "Verified"}</span>
                    </div>
                  </div>
                </div>

                {/* Info Section */}
                <div className="p-4 flex flex-col gap-4 bg-linear-to-b from-[#0a0a0a] to-[#050505]">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 bg-gold/10 border border-gold/30 rounded-full text-[6px] font-black text-gold uppercase tracking-[0.2em]">
                      {model.category}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pb-2 border-b border-white/5">
                    <div className="text-center">
                      <div className="text-[5px] font-black uppercase tracking-widest text-white/20 mb-1">Views</div>
                      <div className="text-sm font-black text-white tabular-nums leading-none">
                        {(model.views || 0).toLocaleString()}
                      </div>
                    </div>
                    <div className="text-center border-l border-white/5">
                      <div className="text-[5px] font-black uppercase tracking-widest text-gold/40 mb-1">Heat</div>
                      <div className="text-sm font-black text-gold tabular-nums leading-none">
                        {model.heatScore}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <motion.button
                      onClick={handleLinkClick}
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        "group relative w-full h-9 rounded-lg flex items-center justify-center gap-2 overflow-hidden shadow-lg transition-all",
                        model.featured 
                          ? "bg-linear-to-r from-blue-600 via-cyan-400 to-blue-500" 
                          : "bg-linear-to-r from-[#bf953f] via-[#fcf6ba] to-[#b38728]"
                      )}
                    >
                      <span className={cn(
                        "relative z-10 text-[9px] font-black uppercase tracking-[0.2em] italic",
                        model.featured ? "text-white" : "text-black"
                      )}>
                        {model.featured ? "Admin's Pick" : "Unlock Profile"}
                      </span>
                      <ExternalLink className={cn("relative z-10 w-3 h-3", model.featured ? "text-white" : "text-black")} />
                    </motion.button>

                    <div className="flex gap-2">
                      <button
                        onClick={() => onToggleFavorite?.(model.id)}
                        className={cn(
                          "flex-1 h-8 rounded-lg border flex items-center justify-center gap-2 transition-all font-black uppercase tracking-widest text-[6px]",
                          isFavorite 
                            ? "bg-red-500/10 border-red-500 text-red-500" 
                            : "bg-white/5 border-white/10 text-white/40 hover:text-white"
                        )}
                      >
                        <Heart className={cn("w-2.5 h-2.5", isFavorite && "fill-current")} />
                        {isFavorite ? "Saved" : "Save"}
                      </button>
                      <button className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40">
                        <Share2 className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Gallery Lightbox */}
      <ImageLightbox
        images={galleryImages}
        initialIndex={lightboxIndex}
        isOpen={lightboxIndex >= 0}
        onClose={() => setLightboxIndex(-1)}
      />
    </AnimatePresence>
  );
}
