const memoForm = document.querySelector('#memo-form');
const memoContent = document.querySelector('#memo-content');
const memoList = document.querySelector('#memo-list');

const financeForm = document.querySelector('#finance-form');
const financeMonth = document.querySelector('#finance-month');
const financeType = document.querySelector('#finance-type');
const financeAmount = document.querySelector('#finance-amount');
const financeNote = document.querySelector('#finance-note');
const financeList = document.querySelector('#finance-list');
const monthlySummary = document.querySelector('#monthly-summary');

const now = new Date();
financeMonth.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

function toLocalTime(isoString) {
  const value = new Date(isoString);
  if (Number.isNaN(value.getTime())) return '-';
  return value.toLocaleString('zh-CN');
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || '请求失败');
  }
  return data;
}

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

function renderMemos(memos) {
  memoList.innerHTML = '';

  if (!memos.length) {
    const empty = document.createElement('li');
    empty.textContent = '暂无备忘。';
    memoList.append(empty);
    return;
  }

  memos.forEach((memo) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="item-main">
        <div>${memo.content}</div>
        <div class="item-meta">创建时间：${toLocalTime(memo.createdAt)}</div>
      </div>
      <button class="delete-btn" data-kind="memo" data-id="${memo.id}" type="button">删除</button>
    `;
    memoList.append(li);
  });
}

function renderRecords(records, month) {
  financeList.innerHTML = '';

  const { income, expense } = calcMonthSummary(records);
  monthlySummary.innerHTML = `
    <strong>${month || '未选择月份'} 汇总：</strong>
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

  records
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .forEach((record) => {
      const li = document.createElement('li');
      const typeText = record.type === 'income' ? '收入' : '支出';
      const typeClass = record.type === 'income' ? 'income' : 'expense';
      li.innerHTML = `
        <div class="item-main">
          <div><strong>${record.note}</strong></div>
          <div class="item-meta">${record.month} · ${toLocalTime(record.createdAt)}</div>
        </div>
        <div class="${typeClass}">${typeText} ¥${record.amount.toFixed(2)}</div>
        <button class="delete-btn" data-kind="record" data-id="${record.id}" type="button">删除</button>
      `;
      financeList.append(li);
    });
}

async function renderAll() {
  const month = financeMonth.value;
  const [memos, records] = await Promise.all([
    requestJson('/api/memos'),
    requestJson(`/api/records?month=${encodeURIComponent(month)}`)
  ]);

  renderMemos(memos);
  renderRecords(records, month);
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
    await renderAll();
  } catch (error) {
    alert(error.message);
  }
});

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

memoList.addEventListener('click', async (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  if (target.dataset.kind === 'memo') {
    const id = target.dataset.id;
    try {
      await requestJson(`/api/memos/${id}`, { method: 'DELETE' });
      await renderAll();
    } catch (error) {
      alert(error.message);
    }
  }
});

financeList.addEventListener('click', async (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  if (target.dataset.kind === 'record') {
    const id = target.dataset.id;
    try {
      await requestJson(`/api/records/${id}`, { method: 'DELETE' });
      await renderAll();
    } catch (error) {
      alert(error.message);
    }
  }
});

financeMonth.addEventListener('change', () => {
  renderAll().catch((error) => alert(error.message));
});

renderAll().catch((error) => {
  monthlySummary.textContent = `加载失败：${error.message}`;
});
