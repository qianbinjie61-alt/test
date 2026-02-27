const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const HOST = '0.0.0.0';
const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DATA_FILE)) {
    const initialData = { memos: [], records: [] };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
  }
}

function readStore() {
  ensureDataFile();
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  try {
    const data = JSON.parse(raw);
    return {
      memos: Array.isArray(data.memos) ? data.memos : [],
      records: Array.isArray(data.records) ? data.records : []
    };
  } catch {
    return { memos: [], records: [] };
  }
}

function writeStore(data) {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

function uid() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function sendJson(res, statusCode, body) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store'
  });
  res.end(JSON.stringify(body));
}

function getContentType(filePath) {
  if (filePath.endsWith('.html')) return 'text/html; charset=utf-8';
  if (filePath.endsWith('.css')) return 'text/css; charset=utf-8';
  if (filePath.endsWith('.js')) return 'application/javascript; charset=utf-8';
  if (filePath.endsWith('.json')) return 'application/json; charset=utf-8';
  return 'text/plain; charset=utf-8';
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 1e6) {
        reject(new Error('请求体过大'));
      }
    });

    req.on('end', () => {
      if (!body) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error('JSON 格式错误'));
      }
    });

    req.on('error', reject);
  });
}

function serveStatic(reqPath, res) {
  const normalizedPath = reqPath === '/' ? '/index.html' : reqPath;
  const filePath = path.join(PUBLIC_DIR, path.normalize(normalizedPath));

  if (!filePath.startsWith(PUBLIC_DIR)) {
    sendJson(res, 403, { message: '无权限访问该资源' });
    return;
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      sendJson(res, 404, { message: '资源不存在' });
      return;
    }

    res.writeHead(200, { 'Content-Type': getContentType(filePath) });
    res.end(content);
  });
}

async function handleApi(req, res, parsedUrl) {
  const pathname = parsedUrl.pathname;
  const method = req.method;
  const store = readStore();

  if (pathname === '/api/health' && method === 'GET') {
    sendJson(res, 200, { ok: true });
    return;
  }

  if (pathname === '/api/memos' && method === 'GET') {
    sendJson(res, 200, store.memos);
    return;
  }

  if (pathname === '/api/memos' && method === 'POST') {
    const body = await parseBody(req);
    const content = String(body.content || '').trim();

    if (!content) {
      sendJson(res, 400, { message: '备忘内容不能为空' });
      return;
    }

    const memo = {
      id: uid(),
      content,
      createdAt: new Date().toISOString()
    };

    store.memos.unshift(memo);
    writeStore(store);
    sendJson(res, 201, memo);
    return;
  }

  if (pathname.startsWith('/api/memos/') && method === 'DELETE') {
    const id = pathname.split('/').pop();
    const next = store.memos.filter((memo) => memo.id !== id);
    const changed = next.length !== store.memos.length;

    if (!changed) {
      sendJson(res, 404, { message: '备忘不存在' });
      return;
    }

    store.memos = next;
    writeStore(store);
    sendJson(res, 200, { ok: true });
    return;
  }

  if (pathname === '/api/records' && method === 'GET') {
    const month = parsedUrl.searchParams.get('month');
    const records = month
      ? store.records.filter((record) => record.month === month)
      : store.records;
    sendJson(res, 200, records);
    return;
  }

  if (pathname === '/api/records' && method === 'POST') {
    const body = await parseBody(req);
    const month = String(body.month || '').trim();
    const type = String(body.type || '').trim();
    const note = String(body.note || '').trim();
    const amount = Number(body.amount);

    const monthValid = /^\d{4}-\d{2}$/.test(month);
    const typeValid = type === 'income' || type === 'expense';

    if (!monthValid || !typeValid || !note || Number.isNaN(amount) || amount < 0) {
      sendJson(res, 400, { message: '记账参数不合法' });
      return;
    }

    const record = {
      id: uid(),
      month,
      type,
      amount,
      note,
      createdAt: new Date().toISOString()
    };

    store.records.push(record);
    writeStore(store);
    sendJson(res, 201, record);
    return;
  }

  if (pathname.startsWith('/api/records/') && method === 'DELETE') {
    const id = pathname.split('/').pop();
    const next = store.records.filter((record) => record.id !== id);
    const changed = next.length !== store.records.length;

    if (!changed) {
      sendJson(res, 404, { message: '记录不存在' });
      return;
    }

    store.records = next;
    writeStore(store);
    sendJson(res, 200, { ok: true });
    return;
  }

  sendJson(res, 404, { message: 'API 路径不存在' });
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  try {
    if (parsedUrl.pathname.startsWith('/api/')) {
      await handleApi(req, res, parsedUrl);
      return;
    }

    if (req.method === 'GET') {
      serveStatic(parsedUrl.pathname, res);
      return;
    }

    sendJson(res, 405, { message: '不支持的请求方法' });
  } catch (error) {
    sendJson(res, 500, { message: error.message || '服务器内部错误' });
  }
});

server.listen(PORT, HOST, () => {
  ensureDataFile();
  console.log(`Server running at http://${HOST}:${PORT}`);
});
