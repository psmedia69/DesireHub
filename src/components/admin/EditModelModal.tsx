import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { ModelProfile, ModelCategory } from '../../types';
import { X, Loader2, Check, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { sanitizeImageUrl, isVideoUrl } from '../../lib/imageUtils';

interface EditModelModalProps {
  model: ModelProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditModelModal({ model, isOpen, onClose, onSuccess }: EditModelModalProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'DESI' as ModelCategory,
    imageUrl: '',
    link: '',
    countryName: '',
    displayCategory: '',
    followersCount: '',
    featured: false,
    galleryUrls: '',
  });
  const [existingImageUrl, setExistingImageUrl] = useState('');

  useEffect(() => {
    if (model) {
      setFormData({
        name: model.name,
        category: model.category,
        imageUrl: model.thumbnail,
        link: model.socials?.instagram || model.socials?.onlyfans || '',
        countryName: model.countryName || '',
        displayCategory: model.displayCategory || '',
        followersCount: model.followersCount || '',
        featured: model.featured || false,
        galleryUrls: (model.gallery || []).join('\n'),
      });
      setExistingImageUrl(model.thumbnail);
      setPreviewUrl(model.thumbnail);
      setError(null);
    }
  }, [model]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!model) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const finalImageUrl = sanitizeImageUrl(formData.imageUrl || existingImageUrl);

      if (!finalImageUrl) {
        throw new Error('Please provide a profile image URL');
      }

      // Process gallery URLs
      const galleryArray = formData.galleryUrls
        .split(/[\n,]/)
        .map(url => sanitizeImageUrl(url.trim()))
        .filter(url => url !== '');

      const { error: updateError } = await supabase
        .from('models')
        .update({
          name: formData.name,
          category: formData.category,
          country_name: formData.countryName,
          display_category: formData.displayCategory,
          followers_count: formData.followersCount,
          image: finalImageUrl,
          gallery: galleryArray,
          link: formData.link,
          featured: formData.featured,
        })
        .eq('id', model.id);

      if (updateError) throw updateError;

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onSuccess();
        onClose();
      }, 1500);
    } catch (err: any) {
      console.error('Error updating model:', err);
      setError(err.message || 'Error updating profile. Check if "models" bucket exists.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl glass-panel rounded-3xl overflow-hidden shadow-2xl border border-white/10"
          >
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="logo-text text-2xl text-gold-gradient">Edit Profile</h2>
                  <p className="text-[10px] opacity-40 uppercase tracking-[0.2em] mt-1">Updating Entry: {model?.name}</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors opacity-50 hover:opacity-100"
                  title="Close edit modal"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-500 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">Creator Name</label>
                    <input
                      required
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-gold/40 outline-none transition-all text-sm text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">Category</label>
                    <select
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value as ModelCategory})}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-gold/40 outline-none transition-all appearance-none text-sm text-white"
                    >
                      <option value="DESI">DESI</option>
                      <option value="Latina">Latina</option>
                      <option value="White">White</option>
                      <option value="Arab">Arab</option>
                      <option value="Asian">Asian</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">Country Name</label>
                    <input
                      required
                      value={formData.countryName}
                      onChange={e => setFormData({...formData, countryName: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-gold/40 outline-none transition-all text-sm text-white"
                      placeholder="e.g. India"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">Display Category</label>
                    <input
                      required
                      value={formData.displayCategory}
                      onChange={e => setFormData({...formData, displayCategory: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-gold/40 outline-none transition-all text-sm text-white"
                      placeholder="e.g. Influencer"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">Followers Info</label>
                    <input
                      required
                      value={formData.followersCount}
                      onChange={e => setFormData({...formData, followersCount: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-gold/40 outline-none transition-all text-sm text-white"
                      placeholder="e.g. 120K followers"
                    />
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                    <div 
                      onClick={() => setFormData({...formData, featured: !formData.featured})}
                      className={cn(
                        "w-10 h-5 rounded-full relative cursor-pointer transition-all duration-300",
                        formData.featured ? "bg-gold" : "bg-white/10"
                      )}
                    >
                      <div className={cn(
                        "absolute top-1 left-1 w-3 h-3 rounded-full bg-white transition-all duration-300",
                        formData.featured ? "translate-x-5" : "translate-x-0"
                      )} />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-white">Featured Profile</div>
                      <div className="text-[8px] opacity-40 uppercase">Sticky badge on profile card</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">Profile Image URL</label>
                    <input
                      required
                      value={formData.imageUrl}
                      onChange={e => {
                        const sanitized = sanitizeImageUrl(e.target.value);
                        setFormData({...formData, imageUrl: sanitized});
                        setPreviewUrl(sanitized);
                      }}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-gold/40 outline-none transition-all text-white text-sm"
                      placeholder="https://images.unsplash.com/..."
                    />
                    {previewUrl && (
                      <div className="flex justify-center mt-4">
                        <div className="aspect-[4/5] relative rounded-xl overflow-hidden bg-white/5 border border-white/10 w-32 shadow-lg">
                          {isVideoUrl(sanitizeImageUrl(previewUrl)) ? (
                            <video 
                              src={sanitizeImageUrl(previewUrl)} 
                              autoPlay 
                              loop 
                              muted 
                              playsInline 
                              className="w-full h-full object-cover" 
                            />
                          ) : (
                            <img 
                              src={sanitizeImageUrl(previewUrl)} 
                              alt="Preview" 
                              className="w-full h-full object-cover" 
                              referrerPolicy="no-referrer"
                            />
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">Profile Link</label>
                    <input
                      required
                      value={formData.link}
                      onChange={e => setFormData({...formData, link: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-gold/40 outline-none transition-all text-sm text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">Gallery Image URLs (One per line)</label>
                    <textarea
                      value={formData.galleryUrls}
                      onChange={e => setFormData({...formData, galleryUrls: e.target.value})}
                      className="w-full px-4 py-3 h-24 rounded-xl bg-white/5 border border-white/10 focus:border-gold/40 outline-none transition-all text-white text-xs resize-none"
                      placeholder="Paste multiple URLs here..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || success}
                    className="w-full py-4 mt-2 rounded-xl bg-gradient-to-r from-gold-dark via-gold to-gold-light text-black font-bold uppercase tracking-[0.2em] text-xs hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : success ? (
                      <>
                        <Check className="w-4 h-4" />
                        Update Saved
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
