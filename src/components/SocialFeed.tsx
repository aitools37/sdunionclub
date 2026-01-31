import React, { useState, useEffect } from 'react';
import { Instagram, Heart, MessageCircle, ExternalLink, Loader, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { fetchInstagramPosts, InstagramPost, INSTAGRAM_PROFILE } from '../services/instagramService';

interface SocialFeedProps {
  limit?: number;
  layout?: 'grid' | 'carousel' | 'list';
}

const SocialFeed: React.FC<SocialFeedProps> = ({ limit = 6, layout = 'grid' }) => {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchInstagramPosts(limit);
      setPosts(data);
    } catch (err) {
      setError('Error al cargar las publicaciones');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [limit]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Hace un momento';
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays}d`;
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="w-8 h-8 animate-spin text-pink-500" />
        <span className="ml-3 text-secondary-600">Cargando Instagram...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <Instagram className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-secondary-600 mb-4">{error}</p>
        <button
          onClick={loadPosts}
          className="inline-flex items-center space-x-2 text-pink-600 hover:text-pink-700 font-medium"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Reintentar</span>
        </button>
      </div>
    );
  }

  if (layout === 'list') {
    return (
      <div className="space-y-4">
        {posts.map((post, index) => (
          <motion.a
            key={post.id}
            href={post.permalink}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start space-x-4 p-4 bg-white rounded-lg hover:shadow-md transition-shadow group"
          >
            <img
              src={post.media_url}
              alt=""
              className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-secondary-900 line-clamp-2 text-sm mb-2">
                {post.caption}
              </p>
              <div className="flex items-center space-x-4 text-xs text-secondary-500">
                <span>{formatDate(post.timestamp)}</span>
                {post.like_count && (
                  <span className="flex items-center space-x-1">
                    <Heart className="w-3 h-3" />
                    <span>{post.like_count}</span>
                  </span>
                )}
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-pink-500 transition-colors flex-shrink-0" />
          </motion.a>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 rounded-lg flex items-center justify-center">
            <Instagram className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-secondary-900">Instagram</h3>
            <a 
              href={INSTAGRAM_PROFILE.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-pink-600 hover:text-pink-700"
            >
              {INSTAGRAM_PROFILE.displayName}
            </a>
          </div>
        </div>
        <a
          href={INSTAGRAM_PROFILE.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-pink-600 hover:text-pink-700 font-medium flex items-center space-x-1"
        >
          <span>Ver más</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Grid */}
      <div className={`grid gap-4 ${
        layout === 'carousel' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6' : 'grid-cols-2 md:grid-cols-3'
      }`}>
        {posts.map((post, index) => (
          <motion.a
            key={post.id}
            href={post.permalink}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="relative aspect-square rounded-lg overflow-hidden group"
          >
            <img
              src={post.media_url}
              alt=""
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="flex items-center space-x-4 text-white">
                {post.like_count && (
                  <div className="flex items-center space-x-1">
                    <Heart className="w-5 h-5" fill="white" />
                    <span className="font-semibold">{post.like_count}</span>
                  </div>
                )}
                {post.comments_count && (
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="w-5 h-5" fill="white" />
                    <span className="font-semibold">{post.comments_count}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Media type indicator */}
            {post.media_type === 'VIDEO' && (
              <div className="absolute top-2 right-2">
                <svg className="w-6 h-6 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            )}
            {post.media_type === 'CAROUSEL_ALBUM' && (
              <div className="absolute top-2 right-2">
                <svg className="w-6 h-6 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2"/>
                  <rect x="7" y="7" width="18" height="18" rx="2" strokeWidth="2"/>
                </svg>
              </div>
            )}
          </motion.a>
        ))}
      </div>

      {/* Follow CTA */}
      <div className="text-center pt-4">
        <a
          href={INSTAGRAM_PROFILE.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
        >
          <Instagram className="w-5 h-5" />
          <span>Seguir en Instagram</span>
        </a>
      </div>
    </div>
  );
};

export default SocialFeed;
