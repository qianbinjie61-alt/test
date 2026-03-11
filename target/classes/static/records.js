const financeForm = document.querySelector('#finance-form');
const financeMonth = document.querySelector('#finance-month');
const financeType = document.querySelector('#finance-type');
const financeAmount = document.querySelector('#finance-amount');
const financeNote = document.querySelector('#finance-note');
const financeList = document.querySelector('#finance-list');
const monthlySummary = document.querySelector('#monthly-summary');
const pagerPrev = document.querySelector('#records-prev');
const pagerNext = document.querySelector('#records-next');
const pageInfo = document.querySelector('#records-page-info');

let page = 0;
const size = 10;
let total = 0;

const now = new Date();
financeMonth.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

function renderRecords(records, month, income, expense) {
  financeList.innerHTML = '';

  monthlySummary.innerHTML = '';
  monthlySummary.append(createTextElement('strong', `${month} Summary:`));
  monthlySummary.insertAdjacentHTML(
    'beforeend',
    ` Income <span class="income">${income.toFixed(2)}</span>, Expense <span class="expense">${expense.toFixed(2)}</span>, Balance <strong>${(income - expense).toFixed(2)}</strong>`
  );

  if (records.length === 0) {
    financeList.append(createTextElement('li', 'No records'));
    return;
  }

  records.forEach((record) => {
    const li = document.createElement('li');

    const main = createTextElement('div', '', 'item-main');
    const link = createTextElement('a', record.note, 'item-link');
    link.href = `/record.html?id=${record.id}`;
    const meta = createTextElement('div', `${record.month} · ${toLocalTime(record.createdAt)}`, 'item-meta');
    main.append(link, meta);

    const typeText = record.type === 'income' ? 'Income' : 'Expense';
    const amount = createTextElement('div', `${typeText} ${Number(record.amount).toFixed(2)}`, record.type === 'income' ? 'income' : 'expense');

    const del = createTextElement('button', 'Delete', 'delete-btn');
    del.type = 'button';
    del.dataset.id = record.id;

    li.append(main, amount, del);
    financeList.append(li);
  });
}

function updatePager() {
  const totalPages = total === 0 ? 0 : Math.ceil(total / size);
  pageInfo.textContent = total === 0 ? 'No data' : `Page ${page + 1} / ${totalPages}, total ${total}`;

  pagerPrev.disabled = page <= 0;
  pagerNext.disabled = total === 0 || (page + 1) * size >= total;
}

async function loadRecords() {
  const month = financeMonth.value;
  const data = await requestJson(`/api/records?month=${encodeURIComponent(month)}&page=${page}&size=${size}`);

  if (page > 0 && data.items.length === 0 && data.total > 0) {
    page -= 1;
    return loadRecords();
  }

  total = data.total;
  const income = Number(data.incomeTotal || 0);
  const expense = Number(data.expenseTotal || 0);
  renderRecords(data.items, month, income, expense);
  updatePager();
}

financeForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const payload = {
    month: financeMonth.value,
    type: financeType.value,
    amount: Number(financeAmount.value),
    note: financeNote.value.trim()
  };

  if (!payload.month || !payload.type || !payload.note || Number.isNaN(payload.amount) || payload.amount < 0) {
    alert('Invalid input');
    return;
  }

  try {
    await requestJson('/api/records', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    financeAmount.value = '';
    financeNote.value = '';
    page = 0;
    await loadRecords();
  } catch (error) {
    if (!isUnauthorizedError(error)) alert(error.message);
  }
});

financeList.addEventListener('click', async (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement) || !target.classList.contains('delete-btn')) return;

  try {
    await requestJson(`/api/records/${target.dataset.id}`, { method: 'DELETE' });
    await loadRecords();
  } catch (error) {
    if (!isUnauthorizedError(error)) alert(error.message);
  }
});

financeMonth.addEventListener('change', () => {
  page = 0;
  loadRecords().catch((error) => {
    if (!isUnauthorizedError(error)) alert(error.message);
  });
});

pagerPrev.addEventListener('click', () => {
  if (page <= 0) return;
  page -= 1;
  loadRecords().catch((error) => {
    if (!isUnauthorizedError(error)) alert(error.message);
  });
});

pagerNext.addEventListener('click', () => {
  if ((page + 1) * size >= total) return;
  page += 1;
  loadRecords().catch((error) => {
    if (!isUnauthorizedError(error)) alert(error.message);
  });
});

loadRecords().catch((error) => {
  if (!isUnauthorizedError(error)) alert(error.message);
});

