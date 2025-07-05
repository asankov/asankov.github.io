import React, { useState } from "react";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { Copy, Check } from "lucide-react";

interface CodeBlockProps {
  children: string;
  language?: string;
  className?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({
  children,
  language = "text",
  className,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  // Format language name for display
  const formatLanguage = (lang: string) => {
    const languageMap: { [key: string]: string } = {
      javascript: "JavaScript",
      typescript: "TypeScript",
      jsx: "JSX",
      tsx: "TSX",
      bash: "Bash",
      shell: "Shell",
      css: "CSS",
      json: "JSON",
      yaml: "YAML",
      yml: "YAML",
      html: "HTML",
      xml: "XML",
      go: "Go",
      python: "Python",
      text: "Text",
    };
    return languageMap[lang];
  };

  return (
    <div className="relative group mb-6">
      <div className="absolute top-3 left-3 z-10">
        <span className="text-gray-500 px-2 py-1 text-xs font-mono">
          {formatLanguage(language)}
        </span>
      </div>
      <div className="absolute top-3 right-3 z-10">
        <button
          onClick={handleCopy}
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-md shadow-lg flex items-center gap-2"
          title={copied ? "Copied!" : "Copy code"}
        >
          {copied ? (
            <>
              <Check size={16} />
              <span className="text-sm">Copied!</span>
            </>
          ) : (
            <>
              <Copy size={16} />
            </>
          )}
        </button>
      </div>
      <SyntaxHighlighter
        style={atomOneDark}
        language={language}
        PreTag="div"
        customStyle={{
          margin: 0,
          borderRadius: "0.5rem",
          fontSize: "0.875rem",
          padding: "1.5rem",
          paddingTop: "3rem", // Add top padding to account for copy button
        }}
      >
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;
