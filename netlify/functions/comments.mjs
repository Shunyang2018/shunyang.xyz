import { getStore } from '@netlify/blobs';
import { randomUUID } from 'node:crypto';
import { publicComment, readComments, saveComment, STORE_NAME, validPost } from '../lib/comments.mjs';

export default async (request) => {
  if (request.method === 'POST') {
    if (!request.headers.get('content-type')?.startsWith('application/json')) return new Response('Expected JSON', { status: 415 });
    const origin = request.headers.get('origin');
    if (origin && origin !== new URL(request.url).origin) return new Response('Invalid origin', { status: 403 });
    const raw = await request.text();
    if (raw.length > 20000) return new Response('Too large', { status: 413 });
    let data;
    try { data = JSON.parse(raw); } catch { return new Response('Invalid JSON', { status: 400 }); }
    const payload = { id: data?.id || randomUUID(), created_at: new Date().toISOString(), form_name: 'blog-comments', data };
    const comment = publicComment(payload);
    if (!comment) return Response.json({ error: '请填写有效的昵称和留言。' }, { status: 400 });
    try {
      // Preserve the existing Forms inbox, exports and email notification, without relying on event callbacks.
      const form = new URLSearchParams({ 'form-name': 'blog-comments', post: comment.post,
        page: `https://shunyangwang.netlify.app/posts/${comment.post}/`, name: comment.name, message: comment.message, 'bot-field': '' });
      const receipt = await fetch('https://shunyangwang.netlify.app/', {
        method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: form.toString()
      });
      if (!receipt.ok) throw new Error('Forms inbox unavailable');
      const store = getStore({ name: STORE_NAME, consistency: 'strong' });
      const saved = await saveComment(store, payload);
      if (!saved) {
        const previous = await store.get(`${comment.post}/${comment.id}`, { type: 'json' });
        if (previous?.name !== comment.name || previous?.message !== comment.message)
          return Response.json({ error: 'Duplicate comment ID' }, { status: 409 });
      }
      return Response.json({ comment }, { status: 201, headers: { 'Cache-Control': 'no-store' } });
    } catch {
      return Response.json({ error: '暂时无法发布，请稍后重试。' }, { status: 503 });
    }
  }
  if (request.method !== 'GET') return new Response('Method not allowed', { status: 405, headers: { Allow: 'GET, POST' } });
  const post = new URL(request.url).searchParams.get('post');
  if (!validPost(post)) return Response.json({ error: 'Invalid post' }, { status: 400 });
  try {
    const comments = await readComments(getStore({ name: STORE_NAME, consistency: 'strong' }), post);
    return Response.json({ comments }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return Response.json({ error: 'Comments unavailable' }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }
};
