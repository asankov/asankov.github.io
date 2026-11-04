import { getCollection } from 'astro:content';

export async function getPosts() {
  return (await getCollection('posts')).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit', month: 'long', year: 'numeric', timeZone: 'UTC',
  }).format(date);
}

export function readTime(body = '') {
  const words = body.trim().split(/\s+/).length;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
}
