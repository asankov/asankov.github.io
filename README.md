# asankov.github.io

The source for [asankov.dev](https://asankov.dev), built with [Astro](https://astro.build/) and hosted on GitHub Pages.

Astro renders the posts, About page, and CV into complete HTML during the build. Visitors receive readable pages without waiting for JavaScript or fetching Markdown/YAML in the browser. GitHub Pages supports this static prerendering; it cannot run a server for request-time SSR. See [Astro's rendering guide](https://docs.astro.build/en/guides/on-demand-rendering/).

## Local development

Use Node.js 22.23.4 or newer. Node.js 24 is recommended and selected by `.nvmrc` and CI.

```sh
nvm use
npm ci
npm run dev
```

To validate and preview the production output:

```sh
npm run check
npm run build
npm test
npm run preview
```

`npm test` checks the generated `dist/` site, so run the build first. `npm run preview` serves that same output locally.

## Content

Articles stay in `public/articles/*.md`. Astro's content collection validates their frontmatter and generates the index and article pages during the build. The filename determines the URL: `example.md` becomes `/post/example/`.

```yaml
---
title: "Article title"
description: "A short summary for the post list and metadata."
date: 2026-11-04
categories:
  - Go
aliases:
  - /2026/11/04/example/
---
```

`title`, `description`, and `date` are required; `categories` and `aliases` are optional. Aliases generate static redirect pages for older article URLs. The schema lives in `src/content.config.ts`; no separate article-index generation step is needed. Markdown supports tables, fenced code blocks with syntax highlighting, and heading links.

The CV remains in `public/cv-data.yaml`. It is read and validated at build time by `src/lib/cv.ts`. Edit the YAML and rebuild to update the page.

## GitHub Pages deployment

The workflow in `.github/workflows/deploy.yml` installs dependencies, checks types, builds, and tests the generated site for pull requests targeting `main` and pushes to `main`. Only a successful push to `main`, or a manual workflow run on `main`, proceeds to deployment. Pull requests never deploy.

In the repository's **Settings → Pages**, set **Build and deployment → Source** to **GitHub Actions** and keep the custom domain set to `asankov.dev`. The workflow uploads `dist/` and deploys it through the `github-pages` environment. See [GitHub's custom workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

`astro.config.mjs` sets the canonical site URL to `https://asankov.dev`. `public/CNAME` preserves the domain in the generated output. The site is served from the domain root, so no repository base path is configured.

Routes such as `/about/`, `/cv/`, and `/post/example/` have their own generated HTML files and work on direct visits or reloads. `404.html` is a real error page rather than a single-page-app routing fallback.
