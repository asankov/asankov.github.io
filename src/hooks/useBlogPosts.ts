import { useState, useEffect } from 'react';
import { BlogPost, loadAllBlogPosts } from '@/services/blogService';

interface UseBlogPostsReturn {
  posts: BlogPost[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useBlogPosts = (): UseBlogPostsReturn => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const loadedPosts = await loadAllBlogPosts();
      setPosts(loadedPosts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load blog posts');
      console.error('Error loading blog posts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const refetch = () => {
    fetchPosts();
  };

  return {
    posts,
    isLoading,
    error,
    refetch,
  };
}; 