const memoForm = document.querySelector('#memo-form');
const memoContent = document.querySelector('#memo-content');
const memoList = document.querySelector('#memo-list');

function renderMemos(memos) {
  memoList.innerHTML = '';

  if (memos.length === 0) {
    memoList.append(createTextElement('li', '暂无备忘。'));
    return;
  }

  memos.forEach((memo) => {
    const li = document.createElement('li');

    const main = createTextElement('div', '', 'item-main');
    const link = createTextElement('a', memo.content, 'item-link');
    link.href = `/memo.html?id=${memo.id}`;
    const meta = createTextElement('div', `创建时间：${toLocalTime(memo.createdAt)}`, 'item-meta');
    main.append(link, meta);

    const del = createTextElement('button', '删除', 'delete-btn');
    del.type = 'button';
    del.dataset.id = memo.id;

    li.append(main, del);
    memoList.append(li);
  });
}

async function loadMemos() {
  const memos = await requestJson('/api/memos');
  renderMemos(memos);
}

memoForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const content = memoContent.value.trim();
  if (!content) return;

  try {
    await requestJson('/api/memos', {
      method: 'POST',
      body: JSON.stringify({ content })
    });
    memoForm.reset();
    await loadMemos();
  } catch (error) {
    alert(error.message);
  }
});

memoList.addEventListener('click', async (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement) || !target.classList.contains('delete-btn')) return;

  try {
    await requestJson(`/api/memos/${target.dataset.id}`, { method: 'DELETE' });
    await loadMemos();
  } catch (error) {
    alert(error.message);
  }
});

loadMemos().catch((error) => alert(error.message));
