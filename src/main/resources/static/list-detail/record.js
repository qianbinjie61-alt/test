const card = document.querySelector('#record-detail-card');

async function loadRecord() {
  const id = getIdFromQuery();
  if (!id) return (card.textContent = '缺少记录 ID。');
  try {
    const record = await requestJson(`/api/records/${id}`);
    card.innerHTML = '';
    card.append(createTextElement('h2', `记账记录 #${record.id}`));
    card.append(createTextElement('p', `说明：${record.note}`));
    card.append(createTextElement('p', `月份：${record.month}`));
    card.append(createTextElement('p', `类型：${record.type === 'income' ? '收入' : '支出'}`, record.type === 'income' ? 'income' : 'expense'));
    card.append(createTextElement('p', `金额：¥${record.amount.toFixed(2)}`));
    card.append(createTextElement('p', `创建时间：${toLocalTime(record.createdAt)}`, 'item-meta'));
  } catch (e) {
    card.textContent = e.message;
  }
}
loadRecord();
