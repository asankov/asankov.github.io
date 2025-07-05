import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const articlesContentDir = path.join(
  path.dirname(__dirname),
  "public",
  "articles"
);
const publicPostDir = path.join(path.dirname(__dirname), "public", "post");
const publicIndexHtmlPath = path.join(path.dirname(__dirname), "index.html");

// Default meta tags from index.html
const DEFAULT_OG_TITLE = "Anton Sankov's Blog";
const DEFAULT_OG_DESCRIPTION = "Thought on AI and Software Engineering";
const DEFAULT_OG_IMAGE =
  "https://github.com/asankov/asankov.github.io/blob/main/preview.png?raw=true";

// Ensure the public/post directory exists
if (!fs.existsSync(publicPostDir)) {
  fs.mkdirSync(publicPostDir, { recursive: true });
}

async function preRenderBlogPosts() {
  try {
    const files = fs.readdirSync(articlesContentDir);
    const indexHtmlContent = fs.readFileSync(publicIndexHtmlPath, "utf-8");

    for (const file of files) {
      if (file.endsWith(".md")) {
        const filePath = path.join(articlesContentDir, file);
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const { data, content } = matter(fileContent); // 'data' is the front matter, 'content' is the markdown

        const slug = file.replace(/\.md$/, ""); // Get slug from filename
        const htmlContent = marked(content); // Convert markdown to HTML

        const title = data.title || DEFAULT_OG_TITLE;
        const description = data.description || DEFAULT_OG_DESCRIPTION;
        const imageUrl = data.image || DEFAULT_OG_IMAGE;

        // Basic HTML template for each post
        // We'll inject title, description, and the rendered markdown
        const postHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <meta name="description" content="${description}" />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="article" />
    <meta property="og:url" content="https://asankov.dev/post/${slug}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${imageUrl}" />

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="https://asankov.dev/post/${slug}" />
    <meta property="twitter:title" content="${title}" />
    <meta property="twitter:description" content="${description}" />
    <meta property="twitter:image" content="${imageUrl}" />

    <link rel="stylesheet" href="/index.css">
    <script type="module" crossorigin src="/assets/index-xxxxxxxx.js"></script> <!-- Placeholder for Vite's main JS bundle -->
</head>
<body>
    <div id="root"></div>
    <script>
        // Store pre-rendered content for client-side hydration
        window.__PRELOADED_STATE__ = {
            post: {
                slug: "${slug}",
                title: "${title}",
                description: "${description}",
                date: "${data.date ? new Date(data.date).toISOString() : ""}",
                content: ${JSON.stringify(htmlContent)}
            }
        };
    </script>
</body>
</html>
                `;

        const outputFilePath = path.join(publicPostDir, `${slug}.html`);
        fs.writeFileSync(outputFilePath, postHtml);
        console.log(`✅ Pre-rendered: ${outputFilePath}`);
      }
    }
    console.log("Pre-rendering complete.");
  } catch (error) {
    console.error("❌ Error during pre-rendering:", error.message);
    process.exit(1);
  }
}

preRenderBlogPosts();
