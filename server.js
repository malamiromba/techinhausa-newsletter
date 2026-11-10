const http = require('http');
const fs = require('fs');
const path = require('path');
const https = require('https');

const PORT = process.env.PORT || 3000;
const SUBSTACK_FEED_URL = 'https://techinhausa.substack.com/feed';

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.json': 'application/json',
  '.ico': 'image/x-icon'
};

const archiveHandler = require('./api/archive');
const postHandler = require('./api/post');

const server = http.createServer((req, res) => {
  const cleanPath = req.url.split('?')[0];

  if (cleanPath === '/api/archive') {
    return archiveHandler(req, res);
  }
  if (cleanPath === '/api/post') {
    return postHandler(req, res);
  }

  // Substack RSS Proxy Route to bypass browser CORS if needed
  if (req.url === '/api/feed') {
    https.get(SUBSTACK_FEED_URL, (subRes) => {
      let data = '';
      subRes.on('data', chunk => data += chunk);
      subRes.on('end', () => {
        res.writeHead(200, {
          'Content-Type': 'application/xml; charset=utf-8',
          'Access-Control-Allow-Origin': '*'
        });
        res.end(data);
      });
    }).on('error', (err) => {
      res.writeHead(502, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to fetch Substack feed', details: err.message }));
    });
    return;
  }

  // Static File Server
  let filePath = req.url === '/' ? '/index.html' : req.url;
  filePath = path.join(__dirname, filePath.split('?')[0]);

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // Fallback to index.html for SPA routing
        fs.readFile(path.join(__dirname, 'index.html'), (e, fallback) => {
          if (e) {
            res.writeHead(404);
            res.end('Not Found');
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(fallback);
          }
        });
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log(`TechInHausa Newsletter server running at http://localhost:${PORT}`);
});
