const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Служим HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Отдача SWF файла с правильным типом
app.get('/2015e.swf', (req, res) => {
  const swfPath = path.join(__dirname, '2015e.swf');
  if (fs.existsSync(swfPath)) {
    res.setHeader('Content-Type', 'application/x-shockwave-flash');
    fs.createReadStream(swfPath).pipe(res);
  } else {
    res.status(404).send('SWF файл не найден');
  }
});

// Прокси YouTube -> localhost:8080
app.use('/youtube', createProxyMiddleware({
  target: 'http://localhost:8080',
  changeOrigin: true,
  pathRewrite: { '^/youtube': '' }
}));

app.listen(PORT, () => {
  console.log(`Сервер работает на http://localhost:${PORT}`);
});