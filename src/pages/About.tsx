import Header from "@/components/Header";
import MarkdownRenderer from "@/components/MarkdownRenderer";

const About = () => {
  const aboutContent = `# About

Hello! My name is Anton. I'm a software engineer passionate about building elegant solutions to complex problems.

This blog is where I share my thoughts, experiences, and learnings from the world of software development and AI.

## What You'll Find Here

- **Technical deep-dives** into languages, frameworks, and tools
- **Architecture patterns** that have worked (and haven't worked) in real projects
- **Career insights** from years in the software industry
- **Best practices** for writing maintainable, scalable code

## My Background

I've been writing code professionally for over 8 years, working with everything from early-stage startups to enterprise applications.

My current focus areas include:

- Developing AI agents to empower developers and DevOps engineers
- System architecture and scalability
- Developer experience and tooling
- Team collaboration and code quality (e.g. GitOps, CI/CD, etc.)

## Philosophy

I believe that great software is built by great teams, and great teams are built on clear communication, shared standards, and continuous learning.

## Get in Touch

Feel free to reach out if you'd like to discuss any of the topics I write about, collaborate on projects, or just chat about software engineering.

---

*This blog is built with React, TypeScript, and Tailwind CSS. The source code is available on [GitHub](https://github.com/asankov/asankov.github.io).*`;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-4xl mx-auto px-6 py-12">
        <MarkdownRenderer content={aboutContent} />
      </main>
    </div>
  );
};

export default About;
