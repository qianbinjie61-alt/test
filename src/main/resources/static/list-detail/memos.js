const memoForm = document.querySelector('#memo-form');
const memoContent = document.querySelector('#memo-content');
const memoList = document.querySelector('#memo-list');

function renderMemos(memos) {
  memoList.innerHTML = '';
  if (!memos.length) return memoList.append(createTextElement('li', '暂无备忘。'));
  memos.forEach((memo) => {
    const li = document.createElement('li');
    const main = createTextElement('div', '', 'item-main');
    const link = createTextElement('a', memo.content, 'item-link');
    link.href = `./memo.html?id=${memo.id}`;
    main.append(link, createTextElement('div', `创建时间：${toLocalTime(memo.createdAt)}`, 'item-meta'));
    const del = createTextElement('button', '删除', 'delete-btn');
    del.type = 'button';
    del.dataset.id = memo.id;
    li.append(main, del);
    memoList.append(li);
  });
}

async function loadMemos() {
  renderMemos(await requestJson('/api/memos'));
}

memoForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const content = memoContent.value.trim();
  if (!content) return;
  await requestJson('/api/memos', { method: 'POST', body: JSON.stringify({ content }) });
  memoForm.reset();
  await loadMemos();
});

memoList.addEventListener('click', async (e) => {
  const t = e.target;
  if (!(t instanceof HTMLElement) || !t.classList.contains('delete-btn')) return;
  await requestJson(`/api/memos/${t.dataset.id}`, { method: 'DELETE' });
  await loadMemos();
});

loadMemos().catch((e) => alert(e.message));
