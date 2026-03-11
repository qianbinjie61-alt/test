const card = document.querySelector('#record-detail-card');

async function loadRecord() {
  const id = getIdFromQuery();
  if (!id) return (card.textContent = i18n.t('record_missing_id'));
  try {
    const record = await requestJson(`/api/records/${id}`);
    card.innerHTML = '';
    const typeText = record.type === 'income' ? i18n.t('records_income') : i18n.t('records_expense');
    card.append(createTextElement('h2', i18n.t('record_detail_id', { id: record.id })));
    card.append(createTextElement('p', i18n.t('record_note', { note: record.note })));
    card.append(createTextElement('p', i18n.t('record_month', { month: record.month })));
    card.append(createTextElement('p', i18n.t('record_type', { type: typeText }), record.type === 'income' ? 'income' : 'expense'));
    card.append(createTextElement('p', i18n.t('record_amount', { amount: record.amount.toFixed(2) })));
    card.append(createTextElement('p', i18n.t('memos_created', { time: toLocalTime(record.createdAt) }), 'item-meta'));
  } catch (e) {
    card.textContent = e.message;
  }
}
loadRecord();
