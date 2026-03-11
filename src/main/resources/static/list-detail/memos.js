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
  if (!memos.length) return memoList.append(createTextElement('li', i18n.t('memos_empty')));

  memos.forEach((memo) => {
    const li = document.createElement('li');
    const main = createTextElement('div', '', 'item-main');
    const link = createTextElement('a', memo.content, 'item-link');
    link.href = `./memo.html?id=${memo.id}`;
    main.append(link, createTextElement('div', i18n.t('memos_created', { time: toLocalTime(memo.createdAt) }), 'item-meta'));

    const del = createTextElement('button', i18n.t('memos_delete'), 'delete-btn');
    del.type = 'button';
    del.dataset.id = memo.id;

    li.append(main, del);
    memoList.append(li);
  });
}

function updatePager() {
  const totalPages = total === 0 ? 0 : Math.ceil(total / size);
  pageInfo.textContent =
    total === 0
      ? i18n.t('common_no_data')
      : i18n.t('common_page', { page: page + 1, total: totalPages, count: total });

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
  loadMemos().catch((e) => {
    if (!isUnauthorizedError(e)) alert(e.message);
  });
});

pagerNext.addEventListener('click', () => {
  if ((page + 1) * size >= total) return;
  page += 1;
  loadMemos().catch((e) => {
    if (!isUnauthorizedError(e)) alert(e.message);
  });
});

loadMemos().catch((e) => {
  if (!isUnauthorizedError(e)) alert(e.message);
});
