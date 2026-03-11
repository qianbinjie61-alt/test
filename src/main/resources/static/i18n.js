const i18n = (() => {
  const dict = {
    zh: {
      app_title: '备忘录与月度记账系统',
      app_subtitle: '按模块查看清单，并可进入详情页查看单条记录。',
      nav_home: '首页',
      nav_back: '返回',
      nav_prev: '上一页',
      nav_next: '下一页',
      nav_admin: '管理',
      nav_logout: '退出登录',
      nav_lang: 'EN',
      login_title: '登录',
      login_subtitle: '登录后继续使用。',
      login_username: '用户名',
      login_password: '密码',
      login_submit: '登录',
      login_error_required: '用户名和密码必填。',
      login_failed: '登录失败。',
      login_register_link: '注册账号',
      register_title: '注册账号',
      register_subtitle: '注册后需管理员审核。',
      register_submit: '注册',
      register_back: '返回登录',
      register_success: '注册成功，可以登录。',
      register_pending: '注册成功，等待管理员审核。',
      register_failed: '注册失败。',
      admin_title: '用户管理',
      admin_pending: '待审核用户',
      admin_all: '全部用户',
      admin_none_pending: '暂无待审核用户。',
      admin_none_users: '暂无用户。',
      admin_approve: '通过',
      admin_reject: '拒绝',
      admin_delete: '删除',
      admin_delete_confirm: '确认删除该用户？',
      admin_role_admin: '管理员',
      admin_role_user: '普通用户',
      memos_title: '备忘录清单页',
      memos_new: '新备忘录',
      memos_add: '添加备忘录',
      memos_empty: '暂无备忘录。',
      memos_created: '创建时间：{time}',
      memos_delete: '删除',
      records_title: '月度记账清单页',
      records_month: '月份',
      records_type: '类型',
      records_income: '收入',
      records_expense: '支出',
      records_amount: '金额',
      records_note: '说明',
      records_add: '添加记录',
      records_empty: '本月暂无记录。',
      records_summary: '{month} 汇总：收入 {income}，支出 {expense}，结余 {balance}',
      memo_detail_title: '备忘录详情页',
      record_detail_title: '月度记账详情页',
      memo_missing_id: '缺少备忘录 ID。',
      record_missing_id: '缺少记账记录 ID。',
      memo_detail_id: '备忘录 #{id}',
      record_detail_id: '记账记录 #{id}',
      record_note: '说明：{note}',
      record_month: '月份：{month}',
      record_type: '类型：{type}',
      record_amount: '金额：{amount}',
      memo_delete_one: '删除这条备忘录',
      record_delete_one: '删除这条记录',
      list_detail_title: '清单与详情（独立版）',
      list_detail_subtitle: '独立目录，避免路径冲突。',
      list_detail_memos: '备忘录',
      list_detail_records: '月度记账',
      common_loading: '加载中..',
      common_no_data: '暂无数据',
      common_page: '第 {page} / {total} 页，共 {count} 条',
      common_invalid_input: '请正确填写信息。',
      common_request_failed: '请求失败',
      common_unauthorized: '未登录'
    },
    en: {
      app_title: 'Memo & Monthly Finance',
      app_subtitle: 'Browse lists and open details for each record.',
      nav_home: 'Home',
      nav_back: 'Back',
      nav_prev: 'Prev',
      nav_next: 'Next',
      nav_admin: 'Admin',
      nav_logout: 'Logout',
      nav_lang: '中文',
      login_title: 'Login',
      login_subtitle: 'Sign in to continue.',
      login_username: 'Username',
      login_password: 'Password',
      login_submit: 'Sign in',
      login_error_required: 'Username and password required.',
      login_failed: 'Login failed.',
      login_register_link: 'Create account',
      register_title: 'Create account',
      register_subtitle: 'Registration requires admin approval.',
      register_submit: 'Register',
      register_back: 'Back to login',
      register_success: 'Registration successful. You can login now.',
      register_pending: 'Registration submitted. Please wait for admin approval.',
      register_failed: 'Registration failed.',
      admin_title: 'User Management',
      admin_pending: 'Pending Approvals',
      admin_all: 'All Users',
      admin_none_pending: 'No pending users.',
      admin_none_users: 'No users.',
      admin_approve: 'Approve',
      admin_reject: 'Reject',
      admin_delete: 'Delete',
      admin_delete_confirm: 'Delete this user?',
      admin_role_admin: 'ADMIN',
      admin_role_user: 'USER',
      memos_title: 'Memos',
      memos_new: 'New memo',
      memos_add: 'Add memo',
      memos_empty: 'No memos.',
      memos_created: 'Created: {time}',
      memos_delete: 'Delete',
      records_title: 'Monthly Records',
      records_month: 'Month',
      records_type: 'Type',
      records_income: 'Income',
      records_expense: 'Expense',
      records_amount: 'Amount',
      records_note: 'Note',
      records_add: 'Add record',
      records_empty: 'No records for this month.',
      records_summary: '{month} Summary: income {income}, expense {expense}, balance {balance}',
      memo_detail_title: 'Memo Detail',
      record_detail_title: 'Record Detail',
      memo_missing_id: 'Missing memo ID.',
      record_missing_id: 'Missing record ID.',
      memo_detail_id: 'Memo #{id}',
      record_detail_id: 'Record #{id}',
      record_note: 'Note: {note}',
      record_month: 'Month: {month}',
      record_type: 'Type: {type}',
      record_amount: 'Amount: {amount}',
      memo_delete_one: 'Delete this memo',
      record_delete_one: 'Delete this record',
      list_detail_title: 'List + Detail (Standalone)',
      list_detail_subtitle: 'Standalone pages to avoid path conflicts.',
      list_detail_memos: 'Memos',
      list_detail_records: 'Records',
      common_loading: 'Loading...',
      common_no_data: 'No data',
      common_page: 'Page {page} / {total}, total {count}',
      common_invalid_input: 'Invalid input',
      common_request_failed: 'Request failed',
      common_unauthorized: 'Unauthorized'
    }
  };

  function getLanguage() {
    return localStorage.getItem('lang') || 'zh';
  }

  function setLanguage(lang) {
    localStorage.setItem('lang', lang);
  }

  function t(key, params = {}) {
    const lang = getLanguage();
    const text = (dict[lang] && dict[lang][key]) || (dict.en && dict.en[key]) || key;
    return text.replace(/\{(\w+)\}/g, (_, k) => (params[k] ?? `{${k}}`));
  }

  function applyI18n(root = document) {
    root.querySelectorAll('[data-i18n]').forEach((el) => {
      el.textContent = t(el.dataset.i18n);
    });
    root.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      el.setAttribute('placeholder', t(el.dataset.i18nPlaceholder));
    });
    root.querySelectorAll('[data-lang-toggle]').forEach((el) => {
      el.textContent = t('nav_lang');
    });
  }

  return { t, getLanguage, setLanguage, applyI18n };
})();

document.addEventListener('DOMContentLoaded', () => {
  i18n.applyI18n();
});
