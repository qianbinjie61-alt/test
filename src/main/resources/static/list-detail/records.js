const form = document.querySelector('#finance-form');
const monthEl = document.querySelector('#finance-month');
const typeEl = document.querySelector('#finance-type');
const amountEl = document.querySelector('#finance-amount');
const noteEl = document.querySelector('#finance-note');
const listEl = document.querySelector('#finance-list');
const summaryEl = document.querySelector('#monthly-summary');

const now = new Date();
monthEl.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

function render(records, month) {
  listEl.innerHTML = '';
  let income = 0;
  let expense = 0;
  for (const r of records) {
    if (r.type === 'income') income += r.amount;
    if (r.type === 'expense') expense += r.amount;
  }
  summaryEl.innerHTML = `${month} 汇总：收入 <span class="income">¥${income.toFixed(2)}</span>，支出 <span class="expense">¥${expense.toFixed(2)}</span>，结余 <strong>¥${(income - expense).toFixed(2)}</strong>`;
  if (!records.length) return listEl.append(createTextElement('li', '该月份暂无记录。'));

  for (const r of records) {
    const li = document.createElement('li');
    const main = createTextElement('div', '', 'item-main');
    const link = createTextElement('a', r.note, 'item-link');
    link.href = `./record.html?id=${r.id}`;
    main.append(link, createTextElement('div', `${r.month} · ${toLocalTime(r.createdAt)}`, 'item-meta'));
    const amount = createTextElement('div', `${r.type === 'income' ? '收入' : '支出'} ¥${r.amount.toFixed(2)}`, r.type === 'income' ? 'income' : 'expense');
    const del = createTextElement('button', '删除', 'delete-btn');
    del.type = 'button';
    del.dataset.id = r.id;
    li.append(main, amount, del);
    listEl.append(li);
  }
}

async function load() {
  const month = monthEl.value;
  const records = await requestJson(`/api/records?month=${encodeURIComponent(month)}`);
  render(records, month);
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const payload = { month: monthEl.value, type: typeEl.value, amount: Number(amountEl.value), note: noteEl.value.trim() };
  await requestJson('/api/records', { method: 'POST', body: JSON.stringify(payload) });
  amountEl.value = '';
  noteEl.value = '';
  await load();
});

listEl.addEventListener('click', async (e) => {
  const t = e.target;
  if (!(t instanceof HTMLElement) || !t.classList.contains('delete-btn')) return;
  await requestJson(`/api/records/${t.dataset.id}`, { method: 'DELETE' });
  await load();
});

monthEl.addEventListener('change', () => load().catch((e) => alert(e.message)));
load().catch((e) => alert(e.message));
