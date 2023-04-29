const express = require('express');
const path = require('path');

const app = express();

// MIDDLEWARE
// express uygulamasında statik dosyaları kullanmak için 'express static'
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'temp/index.html'));
});

app.get('/', (req, res) => {
  res.send('hello');
});

const port = 3000;

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
