export const STORE_NAME = 'public-blog-comments';
export const validPost = (post) => typeof post === 'string' && /^[a-z0-9-]{1,80}$/.test(post);

// Allowlist public fields; private form metadata never enters this store.
export function publicComment(payload) {
  const data = payload?.data;
  if (!data || (payload.form_name !== 'blog-comments' && data['form-name'] !== 'blog-comments')) return null;
  if (data['bot-field'] || !validPost(data.post)) return null;
  if (typeof data.name !== 'string' || typeof data.message !== 'string') return null;
  const name = data.name.trim(), message = data.message.trim();
  if (!name || name.length > 60 || !message || message.length > 3000) return null;
  if (typeof payload.id !== 'string' || !/^[a-zA-Z0-9-]{1,100}$/.test(payload.id)) return null;
  const created = new Date(payload.created_at);
  if (Number.isNaN(created.getTime())) return null;
  return { id: payload.id, post: data.post, name, message, date: created.toISOString() };
}

export async function saveComment(store, payload) {
  const comment = publicComment(payload);
  if (!comment) return false;
  // Separate keys avoid lost updates; event retries cannot duplicate a submission.
  await store.setJSON(`${comment.post}/${comment.date}-${comment.id}`, comment);
  return true;
}

export async function readComments(store, post) {
  const { blobs } = await store.list({ prefix: `${post}/` });
  const rows = await Promise.all(blobs.map(({ key }) => store.get(key, { type: 'json' })));
  return rows.filter((row) => row && row.post === post)
    .map(({ id, name, message, date }) => ({ id, name, message, date }))
    .sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));
}
