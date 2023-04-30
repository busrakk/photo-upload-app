const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');
const path = require('path');

// model
const Photo = require('./models/Photo');

const app = express();

// connect DB
mongoose
  .connect('mongodb://127.0.0.1:27017/photo-share-app-db', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Successfully Connected'))
  .catch((err) => console.error(err));

// TEMPLATE ENGINE
app.set('view engine', 'ejs');

// MIDDLEWARE
// express uygulamasında statik dosyaları kullanmak için 'express static'
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true })); // url'deki datayı okuma
app.use(express.json()); // url'deki datayı json çevirme

// ROUTE
app.get('/', (req, res) => {
  res.render('index');
});
app.get('/about', (req, res) => {
  res.render('about');
});
app.get('/add', (req, res) => {
  res.render('add');
});

// create a photo 
app.post('/photos', async(req, res) => {
  // console.log(req.body);
  await Photo.create(req.body);
  res.redirect('/');
});

const port = 3000;

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
