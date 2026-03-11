const memoForm = document.querySelector('#memo-form');
const memoContent = document.querySelector('#memo-content');
const memoList = document.querySelector('#memo-list');
const pagerPrev = document.querySelector('#memo-prev');
const pagerNext = document.querySelector('#memo-next');
const pageInfo = document.querySelector('#memo-page-info');

let page = 0;
const size = 10;
let total = 0;

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

function updatePager() {
  const totalPages = total === 0 ? 0 : Math.ceil(total / size);
  pageInfo.textContent = total === 0 ? '暂无数据' : `第 ${page + 1} / ${totalPages} 页，共 ${total} 条`;

  pagerPrev.disabled = page <= 0;
  pagerNext.disabled = total === 0 || (page + 1) * size >= total;
}

async function loadMemos() {
  const data = await requestJson(`/api/memos?page=${page}&size=${size}`);

  if (page > 0 && data.items.length === 0 && data.total > 0) {
    page -= 1;
    return loadMemos();
  }

  total = data.total;
  renderMemos(data.items);
  updatePager();
}

memoForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const content = memoContent.value.trim();
  if (!content) return;
  await requestJson('/api/memos', { method: 'POST', body: JSON.stringify({ content }) });
  memoForm.reset();
  page = 0;
  await loadMemos();
});

memoList.addEventListener('click', async (e) => {
  const t = e.target;
  if (!(t instanceof HTMLElement) || !t.classList.contains('delete-btn')) return;
  await requestJson(`/api/memos/${t.dataset.id}`, { method: 'DELETE' });
  await loadMemos();
});

pagerPrev.addEventListener('click', () => {
  if (page <= 0) return;
  page -= 1;
  loadMemos().catch((e) => alert(e.message));
});

pagerNext.addEventListener('click', () => {
  if ((page + 1) * size >= total) return;
  page += 1;
  loadMemos().catch((e) => alert(e.message));
});

loadMemos().catch((e) => alert(e.message));
