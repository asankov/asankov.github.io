import { useState, useEffect } from 'react';
import { BlogPost, getBlogPostBySlug } from '@/services/blogService';

interface UseBlogPostReturn {
  post: BlogPost | null;
  isLoading: boolean;
  error: string | null;
}

export const useBlogPost = (slug: string | undefined): UseBlogPostReturn => {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setPost(null);
      setIsLoading(false);
      return;
    }

    const fetchPost = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const loadedPost = await getBlogPostBySlug(slug);
        setPost(loadedPost || null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load blog post');
        console.error('Error loading blog post:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  return {
    post,
    isLoading,
    error,
  };
}; 