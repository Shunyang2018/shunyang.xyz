import { getStore } from '@netlify/blobs';
import { readComments, STORE_NAME, validPost } from '../lib/comments.mjs';

export default async (request) => {
  if (request.method !== 'GET') return new Response('Method not allowed', { status: 405, headers: { Allow: 'GET' } });
  const post = new URL(request.url).searchParams.get('post');
  if (!validPost(post)) return Response.json({ error: 'Invalid post' }, { status: 400 });
  try {
    const comments = await readComments(getStore({ name: STORE_NAME, consistency: 'strong' }), post);
    return Response.json({ comments }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return Response.json({ error: 'Comments unavailable' }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }
};
