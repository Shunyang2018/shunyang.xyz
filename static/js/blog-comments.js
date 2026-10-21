(() => {
  const list = document.getElementById('live-comments');
  const form = document.querySelector('form[name="blog-comments"]');
  const status = document.getElementById('comment-status');
  if (!list || !form || !status) return;
  const rendered = new Set();
  const endpoint = `/.netlify/functions/comments?post=${encodeURIComponent(list.dataset.post)}`;

  async function refresh() {
    const response = await fetch(endpoint, { cache: 'no-store' });
    if (!response.ok) throw new Error('Unable to load comments');
    const { comments } = await response.json();
    for (const comment of comments) {
      if (rendered.has(comment.id)) continue;
      list.querySelector('.comments-empty')?.remove();
      const article = document.createElement('article');
      article.className = 'reader-comment';
      const heading = document.createElement('p');
      const name = document.createElement('strong');
      name.textContent = comment.name;
      const date = document.createElement('small');
      date.textContent = ` · ${new Date(comment.date).toLocaleString('zh-CN')}`;
      heading.append(name, date);
      const message = document.createElement('p');
      message.className = 'reader-comment-message';
      message.textContent = comment.message;
      article.append(heading, message);
      list.append(article);
      rendered.add(comment.id);
    }
    return comments;
  }

  refresh().catch(() => { status.textContent = '暂时无法加载最新留言，请稍后刷新。'; });
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const button = form.querySelector('button[type="submit"]');
    const data = new FormData(form);
    button.disabled = true;
    status.textContent = '正在提交……';
    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(data).toString()
      });
      if (!response.ok) throw new Error('Submission failed');
      form.reset();
      status.textContent = '留言已提交，正在同步……';
      for (let attempt = 0; attempt < 10; attempt++) {
        if (attempt) await new Promise((resolve) => setTimeout(resolve, 2000));
        let comments;
        try { comments = await refresh(); } catch { continue; }
        if (comments.some((row) => row.name === data.get('name').trim() && row.message === data.get('message').trim())) {
          status.textContent = '留言已发布，谢谢你！';
          return;
        }
      }
      status.textContent = '留言已收到，显示可能稍有延迟，请稍后刷新。';
    } catch {
      status.textContent = '提交失败，内容已保留，请稍后重试。';
    } finally {
      button.disabled = false;
    }
  });
})();
