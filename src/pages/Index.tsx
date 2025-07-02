import Header from "@/components/Header";
import BlogCard from "@/components/BlogCard";
import { useBlogPosts } from "@/hooks/useBlogPosts";

const Index = () => {
  const { posts, isLoading, error } = useBlogPosts();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading blog posts...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Error Loading Posts
            </h1>
            <p className="text-gray-600">{error}</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-black mb-4">
            Thoughts on AI and Software Engineering
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            A collection of insights, lessons learned, and technical deep-dives
            from the world of software development.
          </p>
        </div>

        <div className="space-y-0">
          {posts.map(post => (
            <BlogCard
              key={post.id}
              title={post.title}
              excerpt={post.excerpt}
              date={post.date}
              slug={post.slug}
              readTime={post.readTime}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;
