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

  if (memos.length === 0) {
    memoList.append(createTextElement('li', 'No memos'));
    return;
  }

  memos.forEach((memo) => {
    const li = document.createElement('li');

    const main = createTextElement('div', '', 'item-main');
    const link = createTextElement('a', memo.content, 'item-link');
    link.href = `/memo.html?id=${memo.id}`;
    const meta = createTextElement('div', `Created: ${toLocalTime(memo.createdAt)}`, 'item-meta');
    main.append(link, meta);

    const del = createTextElement('button', 'Delete', 'delete-btn');
    del.type = 'button';
    del.dataset.id = memo.id;

    li.append(main, del);
    memoList.append(li);
  });
}

function updatePager() {
  const totalPages = total === 0 ? 0 : Math.ceil(total / size);
  pageInfo.textContent = total === 0 ? 'No data' : `Page ${page + 1} / ${totalPages}, total ${total}`;

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
    page = 0;
    await loadMemos();
  } catch (error) {
    if (!isUnauthorizedError(error)) alert(error.message);
  }
});

memoList.addEventListener('click', async (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement) || !target.classList.contains('delete-btn')) return;

  try {
    await requestJson(`/api/memos/${target.dataset.id}`, { method: 'DELETE' });
    await loadMemos();
  } catch (error) {
    if (!isUnauthorizedError(error)) alert(error.message);
  }
});

pagerPrev.addEventListener('click', () => {
  if (page <= 0) return;
  page -= 1;
  loadMemos().catch((error) => {
    if (!isUnauthorizedError(error)) alert(error.message);
  });
});

pagerNext.addEventListener('click', () => {
  if ((page + 1) * size >= total) return;
  page += 1;
  loadMemos().catch((error) => {
    if (!isUnauthorizedError(error)) alert(error.message);
  });
});

loadMemos().catch((error) => {
  if (!isUnauthorizedError(error)) alert(error.message);
});

