// Simple front matter parser for browser environment
const parseFrontMatter = (content: string) => {
  const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontMatterRegex);
  
  if (!match) {
    return { data: {}, content };
  }
  
  const [, yamlString, markdownContent] = match;
  
  // Simple YAML parser for our specific use case
  const data: Record<string, string> = {};
  yamlString.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      let value = line.substring(colonIndex + 1).trim();
      
      // Remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      
      data[key] = value;
    }
  });
  
  return { data, content: markdownContent };
};

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: Date;
  slug: string;
  readTime: string;
}

export interface BlogPostFrontMatter {
  title: string;
  description: string;
  date: string;
  slug: string;
  readTime: string;
}

let cachedPosts: BlogPost[] | null = null;
let cachedArticleFiles: string[] | null = null;

// Get the base path for fetching articles
const getBasePath = (): string => {
  if (import.meta.env.PROD) {
    const basePath = import.meta.env.VITE_BASE_PATH || 'ink-blog-scribe';
    return `/${basePath}`;
  }
  return '';
};

export const loadArticleFiles = async (): Promise<string[]> => {
  if (cachedArticleFiles) {
    return cachedArticleFiles;
  }

  const basePath = getBasePath();
  const response = await fetch(`${basePath}/articles/index.json`);
  if (!response.ok) {
    throw new Error('Failed to load articles index');
  }
  
  cachedArticleFiles = await response.json();
  return cachedArticleFiles;
};

export const loadMarkdownFile = async (filename: string): Promise<string> => {
  const basePath = getBasePath();
  const response = await fetch(`${basePath}/articles/${filename}`);
  if (!response.ok) {
    throw new Error(`Failed to load article: ${filename}`);
  }
  return response.text();
};

export const parseMarkdownWithFrontMatter = (content: string, filename: string): BlogPost => {
  const { data, content: markdownContent } = parseFrontMatter(content);
  const frontMatter = data as unknown as BlogPostFrontMatter;
  
  // Generate ID from filename
  const id = filename.replace('.md', '');
  
  console.log({
    id,
    title: frontMatter.title,
    excerpt: frontMatter.description,
    content: markdownContent,
    date: frontMatter.date,
    slug: id,
    readTime: frontMatter.readTime,
  })
  return {
    id,
    title: frontMatter.title,
    excerpt: frontMatter.description,
    content: markdownContent,
    date: new Date(frontMatter.date),
    slug: id,
    readTime: frontMatter.readTime,
  };
};

export const loadAllBlogPosts = async (): Promise<BlogPost[]> => {
  if (cachedPosts) {
    return cachedPosts;
  }

  try {
    const articleFiles = await loadArticleFiles();
    const posts = await Promise.all(
      articleFiles.map(async (filename) => {
        const content = await loadMarkdownFile(filename);
        return parseMarkdownWithFrontMatter(content, filename);
      })
    );

    // Sort posts by date (newest first)
    cachedPosts = posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return cachedPosts;
  } catch (error) {
    console.error('Failed to load blog posts:', error);
    return [];
  }
};

export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | undefined> => {
  const posts = await loadAllBlogPosts();
  return posts.find(post => post.slug === slug);
};

// Clear cache when needed (useful for development)
export const clearCache = (): void => {
  cachedPosts = null;
  cachedArticleFiles = null;
}; 