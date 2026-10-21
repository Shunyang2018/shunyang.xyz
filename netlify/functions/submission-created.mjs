import { getStore } from '@netlify/blobs';
import { saveComment, STORE_NAME } from '../lib/comments.mjs';

// Netlify verifies platform signatures before invoking this event-only function.
export default async (request) => {
  const { payload } = await request.json();
  await saveComment(getStore({ name: STORE_NAME, consistency: 'strong' }), payload);
  return new Response(null, { status: 204 });
};
