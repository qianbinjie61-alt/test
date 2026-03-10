const card = document.querySelector('#record-detail-card');

async function loadRecordDetail() {
  const id = getIdFromQuery();
  if (!id) {
    card.innerHTML = '<p>缺少记账记录 ID。</p>';
    return;
  }

  try {
    const record = await requestJson(`/api/records/${id}`);
    const typeText = record.type === 'income' ? '收入' : '支出';
    const typeClass = record.type === 'income' ? 'income' : 'expense';

    card.innerHTML = `
      <h2>记账记录 #${record.id}</h2>
      <p><strong>说明：</strong>${record.note}</p>
      <p><strong>月份：</strong>${record.month}</p>
      <p><strong>类型：</strong><span class="${typeClass}">${typeText}</span></p>
      <p><strong>金额：</strong>¥${record.amount.toFixed(2)}</p>
      <p class="item-meta">创建时间：${toLocalTime(record.createdAt)}</p>
    `;
  } catch (error) {
    card.innerHTML = `<p>${error.message}</p>`;
  }
}

loadRecordDetail();
