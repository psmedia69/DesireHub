import React, { useState, memo } from "react";
import { ModelProfile } from "@/src/types";
import { motion, AnimatePresence } from "motion/react";
import { Instagram, Edit3, Trash2, AlertTriangle, Loader2, MousePointer2, ChevronDown, Heart, Share2, Star, Flame, Sparkles, Eye, Compass, ShieldCheck } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { supabase } from "@/src/lib/supabase";
import { toast } from "sonner";
import { isVideoUrl, sanitizeImageUrl } from "@/src/lib/imageUtils";
import ImageLightbox from "./ImageLightbox";

interface ModelCardProps {
  model: ModelProfile;
  isAdmin?: boolean;
  onEdit?: (model: ModelProfile) => void;
  onDeleteSuccess?: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  onInteraction?: (updates: Partial<ModelProfile>) => void;
  onCardClick?: (model: ModelProfile) => void;
  onCountryClick?: (country: string) => void;
  onRedirect?: (model: ModelProfile, url: string) => void;
  className?: string;
}

function ModelCard({ model, isAdmin, onEdit, onDeleteSuccess, isFavorite, onToggleFavorite, onInteraction, onCardClick, onCountryClick, onRedirect, className }: ModelCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [localClicks, setLocalClicks] = useState(model.clicks || 0);
  const [localViews, setLocalViews] = useState(model.views || 0);
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  // Derived Status
  const isElite = localClicks >= 100;
  const isTrending = localViews >= 100;
  const isHot = localClicks >= 20 && localClicks < 100;

  const handleExpand = async () => {
    // Trigger detail view immediately for better UX
    onCardClick?.(model);

    // Increment views in background
    try {
      const newViews = localViews + 1;
      setLocalViews(newViews);
      onInteraction?.({ views: newViews });
      await supabase.from('models').update({ views: newViews }).eq('id', model.id);
    } catch (err) {
      console.error("Failed to update views:", err);
    }
  };

  const thumbnail = sanitizeImageUrl(model.thumbnail);
  const images = [thumbnail, ...(model.gallery || []).map(url => sanitizeImageUrl(url))].filter(Boolean);

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Check out ${model.name} on Desire HUB`,
          text: `Check out ${model.name}'s profile on Desire HUB!`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const url = model.socials?.instagram;
    if (!url) return;

    // 1. Immediately trigger the redirect/screen
    if (onRedirect) {
      onRedirect(model, url);
    } else {
      window.open(url, '_blank');
    }

    // 2. Track interaction in background
    const newClicks = localClicks + 1;
    setLocalClicks(newClicks);
    if (onInteraction) {
      onInteraction({ clicks: newClicks });
    }

    // Background update to Supabase
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

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const imageUrl = model.thumbnail;
      if (imageUrl && imageUrl.includes('/storage/v1/object/public/models/')) {
        const path = imageUrl.split('/storage/v1/object/public/models/')[1];
        if (path) {
          await supabase.storage.from('models').remove([path]);
        }
      }

      const { error } = await supabase.from('models').delete().eq('id', model.id);
      
      if (error) {
        toast.error("Error deleting: " + error.message);
        setIsDeleting(false);
        setShowDeleteConfirm(false);
      } else {
        toast.success(`${model.name} deleted successfully`);
        if (onDeleteSuccess) {
          onDeleteSuccess();
        } else {
          window.location.reload();
        }
      }
    } catch (err) {
      console.error("Delete failed:", err);
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <motion.div 
      id={`model-card-${model.id}`}
      style={{
        transformStyle: "preserve-3d",
        transform: "translateZ(0)",
        willChange: "transform"
      }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ 
          duration: 0.6,
          ease: [0.22, 1, 0.36, 1] // Custom luxury ease
        }}
        whileHover={{ 
          y: -8,
          scale: 1.01,
          transition: { duration: 0.4, ease: "easeOut" }
        }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "group relative glass-premium rounded-[32px] overflow-hidden transition-all duration-300 h-fit premium-border",
        model.featured ? "ring-[1px] ring-white/10" : "hover:ring-1 hover:ring-white/20",
        className
      )}
    >
      {/* Premium Inner Glow - Removed for clarity */}

      {/* Luxury Light Sweep - Removed for clarity */}

      {/* Featured Badge */}
      <div className="absolute top-4 right-4 z-30 flex flex-col items-end gap-2">
        {model.featured && (
          <div className="relative flex items-center justify-center">
            <div className="relative px-4 py-1.5 bg-linear-to-r from-blue-600 via-cyan-400 to-blue-500 rounded-full flex items-center gap-2 shadow-lg border border-white/40 glass-blur">
              <Star className="w-3 h-3 text-white fill-white" />
              <span className="text-[10px] font-black tracking-[0.2em] text-white uppercase">Admin's Pick</span>
            </div>
          </div>
        )}
        {isElite && !model.featured && (
          <div className="relative px-3 py-1 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center gap-1 shadow-lg border border-white/20">
            <Sparkles className="w-3 h-3 text-white" />
            <span className="text-[10px] font-black tracking-widest text-white uppercase">Elite</span>
          </div>
        )}
        {isTrending && (
          <div className="relative px-3 py-1 bg-linear-to-r from-pink-500 to-rose-400 rounded-full flex items-center gap-1 shadow-lg border border-white/20">
            <Sparkles className="w-3 h-3 text-white" />
            <span className="text-[10px] font-black tracking-widest text-white uppercase">Trending</span>
          </div>
        )}
        {isHot && !isElite && !isTrending && (
          <div className="relative px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center gap-1 shadow-lg border border-white/20">
            <Flame className="w-3 h-3 text-white" />
            <span className="text-[10px] font-black tracking-widest text-white uppercase">Hot</span>
          </div>
        )}
      </div>

      {/* Image Container */}
      <div 
        className="aspect-[4/5] md:aspect-square overflow-hidden relative cursor-pointer"
        onClick={handleExpand}
      >
        {isVideoUrl(thumbnail) ? (
          <video
            src={thumbnail}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={thumbnail}
            alt={model.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
        )}
        
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-700" />
        
        {/* Delete Confirmation Overlay */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-black/80 flex flex-col items-center justify-center p-6 text-center premium-overlay"
            >
              <div className="bg-red-500/20 p-4 rounded-full mb-4 border border-red-500/40">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <h5 className="text-white font-bold text-lg mb-2">Are you sure?</h5>
              <p className="text-white/60 text-xs mb-6">This will permanently remove {model.name}'s profile.</p>
              
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                  className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  No, Keep it
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-widest transition-all shadow-[0_4px_15px_rgba(220,38,38,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Yes, Delete"
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Status indicator */}
        <div className="absolute top-4 left-4 right-4 flex items-start justify-between pointer-events-none z-40">
          <div className="flex flex-col gap-2 pointer-events-auto">
            {isAdmin && (
              <div className="flex gap-2">
                {onEdit && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(model);
                    }}
                    className="p-2.5 bg-black/90 hover:bg-gold border border-white/30 hover:border-black/20 rounded-xl transition-all text-gold hover:text-black shadow-2xl backdrop-blur-md"
                    title="Edit Profile"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDeleteConfirm(true);
                  }}
                  className="p-2.5 bg-black/90 hover:bg-red-500 border border-white/30 hover:border-black/20 rounded-xl transition-all text-red-500 hover:text-white shadow-2xl backdrop-blur-md"
                  title="Delete Profile"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
            {model.createdAt && (new Date().getTime() - new Date(model.createdAt).getTime() < 86400000) && (
              <div className="px-3 py-1 bg-black/80 text-white text-[9px] font-bold uppercase tracking-wider rounded-full border border-white/10 flex items-center gap-2 w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                New
              </div>
            )}
          </div>
          
          <div className="flex flex-col items-end gap-2 pointer-events-auto">
            {model.featured && (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-black/60 rounded-full border border-white/10">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" /> 
                <span className="text-[9px] uppercase font-bold tracking-widest text-white/90">Live</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Info Section - Now below the image */}
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <motion.div 
              key={`views-${localViews}`}
              initial={{ scale: 0.9, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-1.5 px-2 py-0.5 bg-gold/10 rounded-md border border-gold/20"
              title="Profile Views"
            >
              <Eye className="w-2.5 h-2.5 text-gold" />
              <span className="text-[10px] font-bold text-gold tracking-wide">
                {localViews.toLocaleString()}
              </span>
            </motion.div>

            <motion.div 
              key={`clicks-${localClicks}`}
              initial={{ scale: 0.9, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-1.5 px-2 py-0.5 bg-white/5 rounded-md border border-white/10"
              title="External Link Clicks"
            >
              <MousePointer2 className="w-2.5 h-2.5 text-white/50" />
              <span className="text-[10px] font-bold text-white/70 tracking-wide">
                {localClicks.toLocaleString()}
              </span>
            </motion.div>
          </div>
          
          {model.countryName && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onCountryClick?.(model.countryName!);
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white/5 rounded-lg border border-white/10 hover:bg-gold/10 hover:border-gold/30 transition-all cursor-pointer group/country"
            >
              <span className="text-[11px] uppercase font-black tracking-[0.15em] text-[#bf953f] group-hover/country:text-gold">{model.countryName}</span>
            </button>
          )}
        </div>
        
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h4 className="text-white text-lg sm:text-xl font-bold line-clamp-1 leading-none tracking-tight font-sans" title={model.name}>
                {model.name}
              </h4>
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className="text-white/40 text-[9px] font-black uppercase tracking-[0.15em]">
                  {model.displayCategory || model.category}
                </span>
                <span className="text-white/20 text-[9px]">•</span>
                <span className="text-white/40 text-[9px] font-black uppercase tracking-[0.15em]">
                  {model.followersCount || "Verified"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={(e) => { e.stopPropagation(); onToggleFavorite?.(model.id); }}
                className={cn("p-1.5 rounded-full bg-white/5 border border-white/10 transition-colors", isFavorite ? "text-red-500 border-red-500/30 bg-red-500/10" : "text-white/40 hover:text-white")}
              >
                <Heart className="w-4 h-4" fill={isFavorite ? "currentColor" : "none"} />
              </button>
              <button 
                onClick={handleShare}
                className="p-1.5 rounded-full bg-white/5 border border-white/10 text-white/40 hover:text-white transition-colors"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <motion.button 
            onClick={handleLinkClick}
            whileHover={{ y: -3, scale: 1.01 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            whileTap={{ scale: 0.98 }}
            style={{
              background: model.featured 
                ? "linear-gradient(135deg, #1e40af, #3b82f6)" 
                : "linear-gradient(135deg, #bf953f, #aa771c)",
              color: "white",
              boxShadow: model.featured 
                ? "0 10px 30px -5px rgba(30, 64, 175, 0.4)" 
                : "0 10px 30px -5px rgba(191, 149, 63, 0.3)"
            }}
            className="w-full py-4 rounded-2xl text-[10px] sm:text-[11px] md:text-[10px] lg:text-[11px] font-black uppercase tracking-[0.25em] flex items-center justify-center cursor-pointer whitespace-nowrap group/unlock relative overflow-hidden"
            title={`View ${model.name}'s Profile on Socials`}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/unlock:animate-[shimmer_2s_infinite] transition-transform" />
            
            <span className="relative z-10 flex items-center gap-2">
              {model.featured ? (
                <>
                  <Compass className="w-3.5 h-3.5 animate-pulse" />
                  <span>ELITE SELECTION</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>UNLOCK ACCESS</span>
                </>
              )}
            </span>
          </motion.button>
        </div>
      </div>

      <ImageLightbox
        images={images}
        initialIndex={lightboxIndex}
        isOpen={lightboxIndex >= 0}
        onClose={() => setLightboxIndex(-1)}
      />
    </motion.div>
  );
}

export default memo(ModelCard, (prevProps, nextProps) => {
  return (
    prevProps.model.id === nextProps.model.id &&
    prevProps.isFavorite === nextProps.isFavorite &&
    prevProps.isAdmin === nextProps.isAdmin &&
    prevProps.model.views === nextProps.model.views &&
    prevProps.model.clicks === nextProps.model.clicks
  );
});
