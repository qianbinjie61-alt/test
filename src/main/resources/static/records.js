const financeForm = document.querySelector('#finance-form');
const financeMonth = document.querySelector('#finance-month');
const financeType = document.querySelector('#finance-type');
const financeAmount = document.querySelector('#finance-amount');
const financeNote = document.querySelector('#finance-note');
const financeList = document.querySelector('#finance-list');
const monthlySummary = document.querySelector('#monthly-summary');

const now = new Date();
financeMonth.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

function calcSummary(records) {
  return records.reduce(
    (acc, record) => {
      if (record.type === 'income') acc.income += record.amount;
      if (record.type === 'expense') acc.expense += record.amount;
      return acc;
    },
    { income: 0, expense: 0 }
  );
}

function renderRecords(records, month) {
  financeList.innerHTML = '';

  const { income, expense } = calcSummary(records);
  monthlySummary.innerHTML = '';
  monthlySummary.append(createTextElement('strong', `${month} 汇总：`));
  monthlySummary.insertAdjacentHTML(
    'beforeend',
    ` 收入 <span class="income">¥${income.toFixed(2)}</span>，支出 <span class="expense">¥${expense.toFixed(2)}</span>，结余 <strong>¥${(income - expense).toFixed(2)}</strong>`
  );

  if (records.length === 0) {
    financeList.append(createTextElement('li', '该月份暂无记录。'));
    return;
  }

  records.forEach((record) => {
    const li = document.createElement('li');

    const main = createTextElement('div', '', 'item-main');
    const link = createTextElement('a', record.note, 'item-link');
    link.href = `/record.html?id=${record.id}`;
    const meta = createTextElement('div', `${record.month} · ${toLocalTime(record.createdAt)}`, 'item-meta');
    main.append(link, meta);

    const typeText = record.type === 'income' ? '收入' : '支出';
    const amount = createTextElement('div', `${typeText} ¥${record.amount.toFixed(2)}`, record.type === 'income' ? 'income' : 'expense');

    const del = createTextElement('button', '删除', 'delete-btn');
    del.type = 'button';
    del.dataset.id = record.id;

    li.append(main, amount, del);
    financeList.append(li);
  });
}

async function loadRecords() {
  const month = financeMonth.value;
  const records = await requestJson(`/api/records?month=${encodeURIComponent(month)}`);
  renderRecords(records, month);
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
    alert('请正确填写记账信息。');
    return;
  }

  try {
    await requestJson('/api/records', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    financeAmount.value = '';
    financeNote.value = '';
    await loadRecords();
  } catch (error) {
    alert(error.message);
  }
});

financeList.addEventListener('click', async (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement) || !target.classList.contains('delete-btn')) return;

  try {
    await requestJson(`/api/records/${target.dataset.id}`, { method: 'DELETE' });
    await loadRecords();
  } catch (error) {
    alert(error.message);
  }
});

financeMonth.addEventListener('change', () => {
  loadRecords().catch((error) => alert(error.message));
});

loadRecords().catch((error) => alert(error.message));
