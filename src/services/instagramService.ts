// Instagram Service for fetching posts
// Note: This requires a backend service or Netlify Functions for actual API calls

export interface InstagramPost {
  id: string;
  caption: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  permalink: string;
  timestamp: string;
  thumbnail_url?: string;
  like_count?: number;
  comments_count?: number;
}

export interface InstagramApiResponse {
  data: InstagramPost[];
  paging?: {
    cursors: {
      before: string;
      after: string;
    };
    next?: string;
  };
}

// Mock data for demonstration - replace with real API calls
const mockInstagramPosts: InstagramPost[] = [
  {
    id: '1',
    caption: '¡Victoria importante del primer equipo! 3-0 ante el CD Laredo en La Planchada. Gran actuación de todo el equipo 💪⚽ #UnionClubAstillero #Victoria #LaPlanchada',
    media_type: 'IMAGE',
    media_url: 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
    permalink: 'https://www.instagram.com/p/C3xYzAbExample1/',
    timestamp: '2024-03-08T18:30:00+00:00',
    like_count: 127,
    comments_count: 15
  },
  {
    id: '2',
    caption: '📸 Galería: Entrenamiento intensivo del primer equipo preparando el próximo partido. Trabajando duro para conseguir los objetivos 🔥 #UnionClubAstillero #Entrenamiento #VamosUnion',
    media_type: 'CAROUSEL_ALBUM',
    media_url: 'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
    permalink: 'https://www.instagram.com/p/C3vWxYbExample2/',
    timestamp: '2024-03-06T16:45:00+00:00',
    like_count: 89,
    comments_count: 8
  },
  {
    id: '3',
    caption: '🎉 Presentamos la nueva camiseta conmemorativa del 102 aniversario del club. Ya disponible en nuestra tienda oficial ✨ #UnionClubAstillero #102Años #CamisetaConmemorativa #TiendaOficial',
    media_type: 'IMAGE',
    media_url: 'https://images.pexels.com/photos/8007362/pexels-photo-8007362.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
    permalink: 'https://www.instagram.com/p/C3tUvYcExample3/',
    timestamp: '2024-03-01T11:30:00+00:00',
    like_count: 203,
    comments_count: 25
  },
  {
    id: '4',
    caption: 'Los más pequeños también entrenan con ganas 👶⚽ Escuelas de fútbol del S.D. Unión Club formando a los futuros cracks #UnionClubAstillero #EscuelasDeFutbol #Cantera #FuturosCracks',
    media_type: 'VIDEO',
    media_url: 'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
    permalink: 'https://www.instagram.com/p/C3rSqYdExample4/',
    timestamp: '2024-02-28T14:20:00+00:00',
    like_count: 156,
    comments_count: 12
  },
  {
    id: '5',
    caption: '📍 La Planchada nos espera para el próximo partido. ¡Vamos a llenar las gradas de verde y apoyar al equipo! 🏟️💚 #UnionClubAstillero #LaPlanchada #VamosUnion',
    media_type: 'IMAGE',
    media_url: 'https://images.pexels.com/photos/114296/pexels-photo-114296.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
    permalink: 'https://www.instagram.com/p/C3pQoYeExample5/',
    timestamp: '2024-02-25T15:30:00+00:00',
    like_count: 92,
    comments_count: 6
  },
  {
    id: '6',
    caption: '🔥 Presentación oficial de los nuevos fichajes para esta temporada. ¡Damos la bienvenida a estos grandes jugadores! #UnionClubAstillero #NuevosFichajes #Bienvenidos',
    media_type: 'CAROUSEL_ALBUM',
    media_url: 'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
    permalink: 'https://www.instagram.com/p/C3nMlYfExample6/',
    timestamp: '2024-02-22T12:00:00+00:00',
    like_count: 178,
    comments_count: 21
  }
];

// Instagram profile constants
export const INSTAGRAM_PROFILE = {
  username: 'unionclubastillero',
  url: 'https://www.instagram.com/unionclubastillero/',
  displayName: '@unionclubastillero'
};

// This function would make the actual API call in a real implementation
export const fetchInstagramPosts = async (limit: number = 10): Promise<InstagramPost[]> => {
  // In a real implementation, this would call your backend service or Netlify Function
  // that makes the authenticated request to Instagram API
  
  // For now, return mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockInstagramPosts.slice(0, limit));
    }, 500);
  });
};

// Helper function to convert Instagram posts to news format
export const convertInstagramPostsToNews = (posts: InstagramPost[]) => {
  return posts.map(post => {
    // Determine category based on caption content
    let category = 'club';
    if (post.caption.toLowerCase().includes('victoria') || 
        post.caption.toLowerCase().includes('partido') ||
        post.caption.toLowerCase().includes('resultado')) {
      category = 'partidos';
    } else if (post.media_type === 'CAROUSEL_ALBUM' || 
               post.caption.toLowerCase().includes('galería') ||
               post.caption.toLowerCase().includes('fotos')) {
      category = 'fotos';
    }

    // Extract title from caption (first line or first 50 chars)
    const title = post.caption.split('\n')[0].substring(0, 50) + 
                 (post.caption.length > 50 ? '...' : '');

    return {
      id: post.id,
      title: title.replace(/[📸🎉💪⚽🔥✨👶]/g, '').trim(),
      summary: post.caption.substring(0, 120) + (post.caption.length > 120 ? '...' : ''),
      content: post.caption,
      category: category,
      date: new Date(post.timestamp).toISOString().split('T')[0],
      time: new Date(post.timestamp).toTimeString().substring(0, 5),
      image: post.media_url,
      author: 'Instagram Oficial',
      views: post.like_count || 0,
      comments: post.comments_count || 0,
      featured: (post.like_count || 0) > 100,
      photoCount: post.media_type === 'CAROUSEL_ALBUM' ? Math.floor(Math.random() * 10) + 5 : undefined,
      instagramUrl: post.permalink
    };
  });
};

// Helper to check if a post is recent (last 24 hours)
export const isRecentPost = (timestamp: string): boolean => {
  const postDate = new Date(timestamp);
  const now = new Date();
  const diffHours = (now.getTime() - postDate.getTime()) / (1000 * 60 * 60);
  return diffHours <= 24;
};