import { Link } from "react-router-dom";

interface BlogCardProps {
  title: string;
  excerpt: string;
  date: Date;
  slug: string;
  readTime: string;
}

const BlogCard = ({ title, excerpt, date, slug, readTime }: BlogCardProps) => {
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <article className="group border-b border-gray-100 pb-8 mb-8 last:border-b-0">
      <Link to={`/post/${slug}`} className="block">
        <h2 className="text-2xl font-bold text-black group-hover:text-gray-700 transition-colors mb-3">
          {title}
        </h2>
        <p className="text-gray-600 mb-4 leading-relaxed">{excerpt}</p>
        <div className="flex items-center text-sm text-gray-500 space-x-4">
          <time>{formatDate(date)}</time>
          {readTime && (
            <>
              <span>•</span>
              <span>{readTime}</span>
            </>
          )}
        </div>
      </Link>
    </article>
  );
};

export default BlogCard;
