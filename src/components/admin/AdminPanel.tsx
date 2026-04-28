import React, { useState, useMemo } from 'react';
import { supabase } from '../../lib/supabase';
import { ModelCategory, ModelProfile } from '../../types';
import { Plus, X, Loader2, Check, MousePointer2, Star, Eye, TrendingUp, BarChart3, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { sanitizeImageUrl, isVideoUrl } from '../../lib/imageUtils';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface AdminPanelProps {
  onModelAdded: () => void;
  models?: ModelProfile[];
}

export default function AdminPanel({ onModelAdded, models = [] }: AdminPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'add' | 'dashboard'>('dashboard');

  const stats = useMemo(() => {
    const totalViews = models.reduce((acc, m) => acc + (m.views || 0), 0);
    const totalClicks = models.reduce((acc, m) => acc + (m.clicks || 0), 0);
    const featuredCount = models.filter(m => m.featured).length;
    const topPerformers = [...models]
      .sort((a, b) => (b.clicks + (b.views / 10)) - (a.clicks + (a.views / 10)))
      .slice(0, 5);

    // Category data for chart
    const categoryDataMap: Record<string, { name: string, clicks: number, views: number }> = {};
    models.forEach(m => {
      if (!categoryDataMap[m.category]) {
        categoryDataMap[m.category] = { name: m.category, clicks: 0, views: 0 };
      }
      categoryDataMap[m.category].clicks += m.clicks || 0;
      categoryDataMap[m.category].views += m.views || 0;
    });

    const categoryData = Object.values(categoryDataMap);

    return { totalViews, totalClicks, featuredCount, topPerformers, categoryData };
  }, [models]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const finalImageUrl = sanitizeImageUrl(formData.imageUrl);

      if (!finalImageUrl) {
        throw new Error('Please provide a profile image URL');
      }

      const galleryArray = formData.galleryUrls
        .split(/[\n,]/)
        .map(url => sanitizeImageUrl(url.trim()))
        .filter(url => url !== '');

      const { error } = await supabase
        .from('models')
        .insert([{
          name: formData.name,
          category: formData.category,
          country_name: formData.countryName,
          display_category: formData.displayCategory,
          followers_count: formData.followersCount,
          image: finalImageUrl,
          gallery: galleryArray,
          link: formData.link,
          clicks: 0,
          views: 0,
          featured: formData.featured,
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setIsOpen(false);
        setFormData({
          name: '',
          category: 'DESI',
          countryName: '',
          displayCategory: '',
          followersCount: '',
          imageUrl: '',
          link: '',
          featured: false,
          galleryUrls: '',
        });
        setPreviewUrl(null);
        onModelAdded();
      }, 2000);
    } catch (err: any) {
      console.error('Error adding model:', err);
      alert('Error: ' + (err.message || 'Check your inputs.'));
    } finally {
      setLoading(false);
    }
  };

  const GOLD_PALETTE = ['#bf953f', '#fcf6ba', '#b38728', '#fbf5b7', '#aa771c'];

  return (
    <div className="mb-12 relative z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full py-4 border-2 border-dashed border-gold/20 rounded-2xl flex items-center justify-center gap-3 hover:bg-gold/5 hover:border-gold/40 transition-all group"
          title="Open Admin Dashboard"
        >
          <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Plus className="w-5 h-5 text-gold" />
          </div>
          <span className="font-bold uppercase tracking-widest text-[10px] text-gold">Executive Console & New Listing</span>
        </button>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="glass-panel rounded-[40px] p-6 md:p-10 border-gold/20 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] relative overflow-hidden"
        >
          {/* Background Gradient Accents */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 blur-[120px] rounded-full -mr-48 -mt-48 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold/5 blur-[100px] rounded-full -ml-32 -mb-32 pointer-events-none" />

          <div className="relative z-10 flex justify-between items-start md:items-center mb-10 flex-col md:flex-row gap-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tight">Executive Management</h2>
              <p className="text-[10px] text-white/40 uppercase tracking-[0.3em]">Accessing system controls...</p>
            </div>

            <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/10 w-full md:w-auto">
              <button 
                onClick={() => setActiveTab('dashboard')} 
                className={cn(
                  "flex-1 md:flex-none uppercase text-[10px] font-black tracking-widest px-6 py-2.5 rounded-xl transition-all", 
                  activeTab === 'dashboard' ? 'bg-gold text-black shadow-lg shadow-gold/20' : 'text-white/40 hover:text-white'
                )}
              >
                Analytics
              </button>
              <button 
                onClick={() => setActiveTab('add')} 
                className={cn(
                  "flex-1 md:flex-none uppercase text-[10px] font-black tracking-widest px-6 py-2.5 rounded-xl transition-all", 
                  activeTab === 'add' ? 'bg-gold text-black shadow-lg shadow-gold/20' : 'text-white/40 hover:text-white'
                )}
              >
                Deploy Listing
              </button>
            </div>

            <button 
              onClick={() => setIsOpen(false)} 
              className="absolute top-0 right-0 p-2 text-white/30 hover:text-white transition-colors"
              title="Close System Console"
            >
              <X className="w-8 h-8" />
            </button>
          </div>

          {activeTab === 'dashboard' ? (
            <div className="space-y-10 animate-fadeIn">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Total Engagement', value: stats.totalClicks.toLocaleString(), sub: 'Clicks', icon: TrendingUp, color: 'text-gold' },
                  { label: 'Platform Reach', value: stats.totalViews.toLocaleString(), sub: 'Impressions', icon: Eye, color: 'text-white' },
                  { label: 'Active Creators', value: models.length, sub: 'Listings', icon: Users, color: 'text-white' },
                  { label: "Admin's Picks", value: stats.featuredCount, sub: 'Featured', icon: Star, color: 'text-blue-500' }
                ].map((stat, i) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={stat.label} 
                    className="bg-white/5 border border-white/10 rounded-3xl p-6 relative overflow-hidden group hover:border-gold/30 transition-all shadow-xl"
                  >
                    <stat.icon className={cn("absolute -right-2 -bottom-2 w-20 h-20 opacity-5 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-700", stat.color)} />
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-2 truncate">{stat.label}</div>
                    <div className={cn("text-4xl font-black mb-1", stat.color)}>{stat.value}</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-white/20">{stat.sub}</div>
                  </motion.div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Performance Chart */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="w-5 h-5 text-gold" />
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white">Performance by Category</h3>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-6 h-64 shadow-inner">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stats.categoryData}>
                        <XAxis 
                          dataKey="name" 
                          stroke="#ffffff33" 
                          fontSize={10} 
                          fontWeight={800} 
                          tickLine={false}
                          axisLine={false}
                          tick={{ fill: '#ffffff66', dy: 10 }}
                        />
                        <YAxis hide />
                        <Tooltip 
                          cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                          contentStyle={{ 
                            backgroundColor: 'rgba(0,0,0,0.95)', 
                            border: '1px solid rgba(212,175,55,0.2)', 
                            borderRadius: '16px',
                            fontSize: '10px',
                            fontWeight: 'bold',
                            textTransform: 'uppercase'
                          }}
                        />
                        <Bar dataKey="clicks" radius={[10, 10, 0, 0]}>
                          {stats.categoryData.map((_entry, index) => (
                            <Cell key={`cell-${index}`} fill={GOLD_PALETTE[index % GOLD_PALETTE.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Top Performers */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-gold" />
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white">Top Performance Index</h3>
                  </div>
                  <div className="space-y-4">
                    {stats.topPerformers.map((model, idx) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + (idx * 0.1) }}
                        key={model.id}
                        className="bg-white/5 border border-white/10 hover:border-gold/40 rounded-2xl p-4 flex items-center justify-between group transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-xl font-black text-gold/30 group-hover:text-gold transition-colors">{idx + 1}</div>
                          <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10">
                            {isVideoUrl(sanitizeImageUrl(model.thumbnail)) ? (
                              <video src={sanitizeImageUrl(model.thumbnail)} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                            ) : (
                              <img src={sanitizeImageUrl(model.thumbnail)} alt={model.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            )}
                          </div>
                          <div>
                            <div className="font-black text-white text-xs uppercase tracking-widest line-clamp-1">{model.name}</div>
                            <div className="text-[10px] text-white/30 uppercase font-bold">{model.category}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-black text-gold">{model.clicks.toLocaleString()}</div>
                          <div className="text-[9px] font-black uppercase tracking-widest text-white/20">Clicks</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-fadeIn">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 ml-1">Creator Designation</label>
                  <input
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-gold/40 outline-none transition-all text-white font-bold placeholder:opacity-20"
                    placeholder="Enter Profile Name..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 ml-1">Classification Category</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value as ModelCategory})}
                    className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-gold/40 outline-none transition-all appearance-none text-white font-bold"
                  >
                    <option value="DESI">DESI</option>
                    <option value="Latina">Latina</option>
                    <option value="White">White</option>
                    <option value="Arab">Arab</option>
                    <option value="Asian">Asian</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 ml-1">Country Name</label>
                  <input
                    required
                    value={formData.countryName}
                    onChange={e => setFormData({...formData, countryName: e.target.value})}
                    className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-gold/40 outline-none transition-all text-white font-bold"
                    placeholder="e.g. India, USA..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 ml-1">Display Category</label>
                  <input
                    required
                    value={formData.displayCategory}
                    onChange={e => setFormData({...formData, displayCategory: e.target.value})}
                    className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-gold/40 outline-none transition-all text-white font-bold"
                    placeholder="e.g. Influencer, Model..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 ml-1">Followers Info</label>
                  <input
                    required
                    value={formData.followersCount}
                    onChange={e => setFormData({...formData, followersCount: e.target.value})}
                    className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-gold/40 outline-none transition-all text-white font-bold"
                    placeholder="e.g. 120K followers"
                  />
                </div>

                <div className="flex items-center gap-4 p-6 bg-gold/5 rounded-3xl border border-gold/20 group cursor-pointer" onClick={() => setFormData({...formData, featured: !formData.featured})}>
                  <div className={cn(
                    "w-12 h-6 rounded-full relative transition-all duration-500",
                    formData.featured ? "bg-gold" : "bg-white/10"
                  )}>
                    <div className={cn(
                      "absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-all duration-500 shadow-xl",
                      formData.featured ? "translate-x-6" : "translate-x-0"
                    )} />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gold group-hover:text-white transition-colors">Admin's Pick</div>
                    <div className="text-[8px] opacity-40 uppercase font-black">Elevates user profile to prominent hero positions</div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 ml-1">Master Image Repository</label>
                  <input
                    required
                    value={formData.imageUrl}
                    onChange={e => {
                      const sanitized = sanitizeImageUrl(e.target.value);
                      setFormData({...formData, imageUrl: sanitized});
                      setPreviewUrl(sanitized);
                    }}
                    className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-gold/40 outline-none transition-all text-white font-bold text-sm"
                    placeholder="Reference URL..."
                  />
                </div>

                {formData.imageUrl && (
                  <div className="flex justify-center">
                    <motion.div 
                      key={formData.imageUrl}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="aspect-[4/5] relative rounded-3xl overflow-hidden bg-white/5 border border-white/10 w-32 shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
                    >
                      {isVideoUrl(sanitizeImageUrl(formData.imageUrl)) ? (
                        <video src={sanitizeImageUrl(formData.imageUrl)} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                      ) : (
                        <img src={sanitizeImageUrl(formData.imageUrl)} alt="System Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      )}
                    </motion.div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 ml-1">Destination Portal</label>
                  <input
                    required
                    value={formData.link}
                    onChange={e => setFormData({...formData, link: e.target.value})}
                    className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-gold/40 outline-none transition-all text-white font-bold"
                    placeholder="https://..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 ml-1">Gallery Manifest (URLs)</label>
                  <textarea
                    value={formData.galleryUrls}
                    onChange={e => setFormData({...formData, galleryUrls: e.target.value})}
                    className="w-full px-6 py-4 h-32 rounded-2xl bg-white/5 border border-white/10 focus:border-gold/40 outline-none transition-all text-white text-xs resize-none font-bold"
                    placeholder="Input multiple links (one per line or separated by comma) to create a swipeable gallery..."
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading || success}
                  className="w-full py-6 rounded-2xl bg-linear-to-r from-[#bf953f] via-[#fcf6ba] to-[#b38728] text-black font-black uppercase tracking-[0.3em] text-xs shadow-2xl shadow-gold/20 disabled:opacity-50 flex items-center justify-center gap-3 transition-all"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : success ? (
                    <>
                      <Check className="w-5 h-5" />
                      Deployment Successful
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      Commit to Network
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          )}
        </motion.div>
      )}
    </div>
  );
}

