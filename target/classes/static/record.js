const card = document.querySelector('#record-detail-card');

async function loadRecord() {
  const id = getIdFromQuery();
  if (!id) {
    card.innerHTML = '';
    card.append(createTextElement('p', '缺少记账记录 ID。'));
    return;
  }

  try {
    const record = await requestJson(`/api/records/${id}`);
    card.innerHTML = '';

    const typeText = record.type === 'income' ? '收入' : '支出';
    const typeClass = record.type === 'income' ? 'income' : 'expense';

    card.append(createTextElement('h2', `记账记录 #${record.id}`));
    card.append(createTextElement('p', `说明：${record.note}`));
    card.append(createTextElement('p', `月份：${record.month}`));
    card.append(createTextElement('p', `类型：${typeText}`, typeClass));
    card.append(createTextElement('p', `金额：¥${record.amount.toFixed(2)}`));
    card.append(createTextElement('p', `创建时间：${toLocalTime(record.createdAt)}`, 'item-meta'));

    const deleteBtn = createTextElement('button', '删除这条记录', 'delete-btn');
    deleteBtn.type = 'button';
    deleteBtn.addEventListener('click', async () => {
      await requestJson(`/api/records/${record.id}`, { method: 'DELETE' });
      window.location.href = '/records.html';
    });
    card.append(deleteBtn);
  } catch (error) {
    card.innerHTML = '';
    card.append(createTextElement('p', error.message));
  }
}

loadRecord();
