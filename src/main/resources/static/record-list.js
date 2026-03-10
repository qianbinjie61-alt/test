const financeForm = document.querySelector('#finance-form');
const financeMonth = document.querySelector('#finance-month');
const financeType = document.querySelector('#finance-type');
const financeAmount = document.querySelector('#finance-amount');
const financeNote = document.querySelector('#finance-note');
const financeList = document.querySelector('#finance-list');
const monthlySummary = document.querySelector('#monthly-summary');

const now = new Date();
financeMonth.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

function calcMonthSummary(records) {
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

  const { income, expense } = calcMonthSummary(records);
  monthlySummary.innerHTML = `
    <strong>${month} 汇总：</strong>
    收入 <span class="income">¥${income.toFixed(2)}</span>，
    支出 <span class="expense">¥${expense.toFixed(2)}</span>，
    结余 <strong>¥${(income - expense).toFixed(2)}</strong>
  `;

  if (!records.length) {
    const empty = document.createElement('li');
    empty.textContent = '该月份暂无记录。';
    financeList.append(empty);
    return;
  }

  records.forEach((record) => {
    const typeText = record.type === 'income' ? '收入' : '支出';
    const typeClass = record.type === 'income' ? 'income' : 'expense';

    const li = document.createElement('li');
    li.innerHTML = `
      <div class="item-main">
        <a class="item-link" href="/record-detail.html?id=${record.id}">${record.note}</a>
        <div class="item-meta">${record.month} · ${toLocalTime(record.createdAt)}</div>
      </div>
      <div class="${typeClass}">${typeText} ¥${record.amount.toFixed(2)}</div>
      <button class="delete-btn" data-id="${record.id}" type="button">删除</button>
    `;

    financeList.append(li);
  });
}

async function renderAll() {
  const month = financeMonth.value;
  const records = await requestJson(`/api/records?month=${encodeURIComponent(month)}`);
  renderRecords(records, month);
}

financeForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const month = financeMonth.value;
  const type = financeType.value;
  const amount = Number(financeAmount.value);
  const note = financeNote.value.trim();

  if (!month || !type || !note || Number.isNaN(amount) || amount < 0) {
    alert('请正确填写记账信息。');
    return;
  }

  try {
    await requestJson('/api/records', {
      method: 'POST',
      body: JSON.stringify({ month, type, amount, note })
    });
    financeAmount.value = '';
    financeNote.value = '';
    await renderAll();
  } catch (error) {
    alert(error.message);
  }
});

financeList.addEventListener('click', async (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  if (target.classList.contains('delete-btn')) {
    try {
      await requestJson(`/api/records/${target.dataset.id}`, { method: 'DELETE' });
      await renderAll();
    } catch (error) {
      alert(error.message);
    }
  }
});

financeMonth.addEventListener('change', () => {
  renderAll().catch((error) => alert(error.message));
});

renderAll().catch((error) => alert(error.message));
