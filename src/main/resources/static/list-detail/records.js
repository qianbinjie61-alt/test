const form = document.querySelector('#finance-form');
const monthEl = document.querySelector('#finance-month');
const typeEl = document.querySelector('#finance-type');
const amountEl = document.querySelector('#finance-amount');
const noteEl = document.querySelector('#finance-note');
const listEl = document.querySelector('#finance-list');
const summaryEl = document.querySelector('#monthly-summary');
const pagerPrev = document.querySelector('#records-prev');
const pagerNext = document.querySelector('#records-next');
const pageInfo = document.querySelector('#records-page-info');

let page = 0;
const size = 10;
let total = 0;

const now = new Date();
monthEl.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

function render(records, month, income, expense) {
  listEl.innerHTML = '';
  summaryEl.textContent = i18n.t('records_summary', {
    month,
    income: income.toFixed(2),
    expense: expense.toFixed(2),
    balance: (income - expense).toFixed(2)
  });
  if (!records.length) return listEl.append(createTextElement('li', i18n.t('records_empty')));

  for (const r of records) {
    const li = document.createElement('li');
    const main = createTextElement('div', '', 'item-main');
    const link = createTextElement('a', r.note, 'item-link');
    link.href = `./record.html?id=${r.id}`;
    main.append(link, createTextElement('div', `${r.month} · ${toLocalTime(r.createdAt)}`, 'item-meta'));

    const amountLabel = r.type === 'income' ? i18n.t('records_income') : i18n.t('records_expense');
    const amount = createTextElement('div', `${amountLabel} ${Number(r.amount).toFixed(2)}`, r.type === 'income' ? 'income' : 'expense');

    const del = createTextElement('button', i18n.t('memos_delete'), 'delete-btn');
    del.type = 'button';
    del.dataset.id = r.id;

    li.append(main, amount, del);
    listEl.append(li);
  }
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

async function load() {
  const month = monthEl.value;
  const data = await requestJson(`/api/records?month=${encodeURIComponent(month)}&page=${page}&size=${size}`);

  if (page > 0 && data.items.length === 0 && data.total > 0) {
    page -= 1;
    return load();
  }

  total = data.total;
  const income = Number(data.incomeTotal || 0);
  const expense = Number(data.expenseTotal || 0);
  render(data.items, month, income, expense);
  updatePager();
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const payload = { month: monthEl.value, type: typeEl.value, amount: Number(amountEl.value), note: noteEl.value.trim() };
  await requestJson('/api/records', { method: 'POST', body: JSON.stringify(payload) });
  amountEl.value = '';
  noteEl.value = '';
  page = 0;
  await load();
});

listEl.addEventListener('click', async (e) => {
  const t = e.target;
  if (!(t instanceof HTMLElement) || !t.classList.contains('delete-btn')) return;
  await requestJson(`/api/records/${t.dataset.id}`, { method: 'DELETE' });
  await load();
});

monthEl.addEventListener('change', () => {
  page = 0;
  load().catch((e) => {
    if (!isUnauthorizedError(e)) alert(e.message);
  });
});

pagerPrev.addEventListener('click', () => {
  if (page <= 0) return;
  page -= 1;
  load().catch((e) => {
    if (!isUnauthorizedError(e)) alert(e.message);
  });
});

pagerNext.addEventListener('click', () => {
  if ((page + 1) * size >= total) return;
  page += 1;
  load().catch((e) => {
    if (!isUnauthorizedError(e)) alert(e.message);
  });
});

load().catch((e) => {
  if (!isUnauthorizedError(e)) alert(e.message);
});
