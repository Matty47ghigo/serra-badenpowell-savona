import React, { useState } from 'react';
import { Instagram, Facebook, Heart, MessageCircle, ExternalLink, Share2 } from 'lucide-react';
import { GREENHOUSE_DATA } from '../data/greenhouseData';

export default function SocialFeed() {
  const [posts, setPosts] = useState(
    GREENHOUSE_DATA.socialPosts.map(p => ({ ...p, isLiked: false }))
  );

  const toggleLike = (id) => {
    setPosts(prev =>
      prev.map(p => {
        if (p.id === id) {
          const nextLiked = !p.isLiked;
          return {
            ...p,
            isLiked: nextLiked,
            likes: nextLiked ? p.likes + 1 : p.likes - 1
          };
        }
        return p;
      })
    );
  };

  const officialFacebook = "https://www.facebook.com/share/1DtFrn6KFS/?mibextid=wwXIfr";
  const officialInstagram = "https://www.instagram.com/serrabadenpowell";

  return (
    <section id="social-feed" className="py-20 sm:py-28 bg-stone-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Share2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>Community & Social Media</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 tracking-tight mb-4">
            I Nostri Canali Social Ufficiali
          </h2>
          <p className="text-stone-600 text-base sm:text-lg">
            Seguici su Instagram e Facebook per scoprire fioriture rare, retroscena della cura 
            delle cactacee e tutte le aperture straordinarie della serra alla Villetta.
          </p>
        </div>

        {/* Social Channel Badges */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-16">
          
          {/* Instagram Official Card */}
          <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-purple-600 via-pink-600 to-amber-500 text-white shadow-xl flex items-center justify-between gap-4 group">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/30 group-hover:scale-110 transition-transform shadow-inner">
                <Instagram className="w-8 h-8 text-white" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-pink-200">
                  Canale Ufficiale Instagram
                </span>
                <h3 className="font-serif font-bold text-xl sm:text-2xl leading-tight">@serrabadenpowell</h3>
                <p className="text-xs text-white/85 mt-0.5">Storie, reel e immagini delle fioriture</p>
              </div>
            </div>
            <a
              href={officialInstagram}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-2xl bg-white text-stone-900 text-xs font-bold hover:bg-stone-100 transition-all shrink-0 flex items-center gap-1.5 shadow-md hover:scale-105"
            >
              <span>Segui</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Facebook Official Card */}
          <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-blue-700 to-indigo-800 text-white shadow-xl flex items-center justify-between gap-4 group">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/30 group-hover:scale-110 transition-transform shadow-inner">
                <Facebook className="w-8 h-8 text-white" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-blue-200">
                  Pagina Ufficiale Facebook
                </span>
                <h3 className="font-serif font-bold text-xl sm:text-2xl leading-tight">Serra Baden Powell</h3>
                <p className="text-xs text-white/85 mt-0.5">Avvisi alla cittadinanza e aggiornamenti</p>
              </div>
            </div>
            <a
              href={officialFacebook}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-2xl bg-white text-blue-900 text-xs font-bold hover:bg-stone-100 transition-all shrink-0 flex items-center gap-1.5 shadow-md hover:scale-105"
            >
              <span>Visita</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>

        {/* Live Feed Display */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {posts.map((post) => (
            <div
              key={post.id}
              className="rounded-3xl bg-white border border-stone-200 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Post Header */}
              <div className="p-4 flex items-center justify-between border-b border-stone-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-lg shadow-sm">
                    {post.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-stone-900 leading-tight">
                      {post.author}
                    </h4>
                    <span className="text-[10px] text-stone-400 font-medium">
                      {post.username} • {post.date}
                    </span>
                  </div>
                </div>

                {post.platform === 'instagram' ? (
                  <Instagram className="w-4 h-4 text-pink-600" />
                ) : (
                  <Facebook className="w-4 h-4 text-blue-600" />
                )}
              </div>

              {/* Post Image */}
              <div className="aspect-square relative overflow-hidden bg-stone-100">
                <img
                  src={post.image}
                  alt="Post social serra baden powell savona"
                  onError={(e) => { if (!e.currentTarget.src.includes('serra-1')) e.currentTarget.src = '/images/serra/serra-1.jpg'; }}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Post Body & Actions */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  {/* Action icons */}
                  <div className="flex items-center justify-between mb-3 text-stone-600">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => toggleLike(post.id)}
                        className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${
                          post.isLiked ? 'text-rose-600' : 'hover:text-rose-600'
                        }`}
                      >
                        <Heart
                          className={`w-5 h-5 ${post.isLiked ? 'fill-rose-600 text-rose-600' : ''}`}
                        />
                        <span>{post.likes}</span>
                      </button>

                      <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-500">
                        <MessageCircle className="w-5 h-5" />
                        <span>{post.comments}</span>
                      </div>
                    </div>

                    <a
                      href={post.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-stone-400 hover:text-stone-800 transition-colors"
                      title="Apri su social"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>

                  {/* Caption */}
                  <p className="text-xs text-stone-700 leading-relaxed line-clamp-4">
                    {post.caption}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                  <span className="text-emerald-700 font-semibold">#serrabadenpowell #savona</span>
                  <a
                    href={post.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-stone-900 hover:text-emerald-700 hover:underline"
                  >
                    Vedi su {post.platform === 'instagram' ? 'Instagram' : 'Facebook'} →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
