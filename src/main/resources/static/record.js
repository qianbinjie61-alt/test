const card = document.querySelector('#record-detail-card');

async function loadRecord() {
  const id = getIdFromQuery();
  if (!id) {
    card.innerHTML = '';
    card.append(createTextElement('p', i18n.t('record_missing_id')));
    return;
  }

  try {
    const record = await requestJson(`/api/records/${id}`);
    card.innerHTML = '';

    const typeText = record.type === 'income' ? i18n.t('records_income') : i18n.t('records_expense');
    const typeClass = record.type === 'income' ? 'income' : 'expense';

    card.append(createTextElement('h2', i18n.t('record_detail_id', { id: record.id })));
    card.append(createTextElement('p', i18n.t('record_note', { note: record.note })));
    card.append(createTextElement('p', i18n.t('record_month', { month: record.month })));
    card.append(createTextElement('p', i18n.t('record_type', { type: typeText }), typeClass));
    card.append(createTextElement('p', i18n.t('record_amount', { amount: record.amount.toFixed(2) })));
    card.append(createTextElement('p', i18n.t('memos_created', { time: toLocalTime(record.createdAt) }), 'item-meta'));

    const deleteBtn = createTextElement('button', i18n.t('record_delete_one'), 'delete-btn');
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
