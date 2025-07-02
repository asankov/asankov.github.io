import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="text-2xl font-bold text-black hover:text-gray-700 transition-colors"
          >
            Anton Sankov's Blog
          </Link>
          <nav className="flex space-x-8">
            <Link
              to="/"
              className="text-black hover:text-gray-600 transition-colors font-medium"
            >
              Posts
            </Link>
            <Link
              to="/about"
              className="text-black hover:text-gray-600 transition-colors font-medium"
            >
              About
            </Link>
            <Link
              to="/cv"
              className="text-black hover:text-gray-600 transition-colors font-medium"
            >
              CV
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
