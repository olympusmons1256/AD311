import http from 'http';
import fs from 'fs';

function startServer() {
  const server = http.createServer((req, res) => {
    if (req.url === '/' || req.url === '/home') {
      fs.readFile('home.html', (err, data) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Internal Server Error');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(data);
        }
      });
    } else if (req.url === '/about') {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('This is the About page.');
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    }
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

startServer();
