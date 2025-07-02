#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directory containing the articles
const articlesDir = path.join(path.dirname(__dirname), "public", "articles");
const outputFile = path.join(articlesDir, "index.json");

function generateArticlesIndex() {
  try {
    // Check if articles directory exists
    if (!fs.existsSync(articlesDir)) {
      console.error(`Articles directory not found: ${articlesDir}`);
      process.exit(1);
    }

    // Read all files in the articles directory
    const files = fs.readdirSync(articlesDir);

    // Filter for markdown files only
    const markdownFiles = files.filter(
      file =>
        file.endsWith(".md") &&
        fs.statSync(path.join(articlesDir, file)).isFile()
    );

    // Sort files alphabetically for consistent ordering
    markdownFiles.sort();

    // Write the index file
    fs.writeFileSync(outputFile, JSON.stringify(markdownFiles, null, 2));

    console.log(
      `✅ Generated articles index with ${markdownFiles.length} files:`
    );
    markdownFiles.forEach(file => console.log(`   - ${file}`));
    console.log(
      `📝 Index saved to: ${path.relative(process.cwd(), outputFile)}`
    );
  } catch (error) {
    console.error("❌ Error generating articles index:", error.message);
    process.exit(1);
  }
}

// Run the script
generateArticlesIndex();
