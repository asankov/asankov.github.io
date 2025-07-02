import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { useBlogPost } from "@/hooks/useBlogPost";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { post, isLoading, error } = useBlogPost(slug);

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading blog post...</p>
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
              Error Loading Post
            </h1>
            <p className="text-gray-600 mb-8">{error}</p>
            <Link
              to="/"
              className="inline-flex items-center text-black hover:text-gray-600 transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to all posts
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-black mb-4">
              Post Not Found
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              The blog post you're looking for doesn't exist.
            </p>
            <Link
              to="/"
              className="inline-flex items-center text-black hover:text-gray-600 transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to all posts
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-gray-600 hover:text-black transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to all posts
          </Link>

          <div className="mb-8">
            <h1 className="text-4xl font-bold text-black mb-4">{post.title}</h1>
            <div className="flex items-center text-gray-500 space-x-4">
              <time>{formatDate(post.date)}</time>
              <span>•</span>
              <span>{post.readTime || "Read time not available"}</span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-12">
          <MarkdownRenderer content={post.content} />
        </div>

        <div className="border-t border-gray-100 mt-16 pt-8">
          <Link
            to="/"
            className="inline-flex items-center text-black hover:text-gray-600 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to all posts
          </Link>
        </div>
      </main>
    </div>
  );
};

export default BlogPost;
