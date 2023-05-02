const express = require('express');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const methodOverride = require('method-override'); // Tarayıcılar PUT requesti desteklemedikleri için PUT requesti tarayıcının anlayacağı POST request şeklinde simüle etme
const ejs = require('ejs');
const path = require('path');
const fs = require('fs');

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
app.use(fileUpload()); // express-fileupload
app.use(
  methodOverride('_method', {
    methods: ['POST', 'GET'],
  })
);

// ROUTE
app.get('/', async (req, res) => {
  // const photos = await Photo.find({}) // veritabanındaki verileri gösterme
  try {
    const photos = await Photo.find({}).sort('-dateCreated');
    res.render('index', {
      photos,
    });
    // console.log(photos);
  } catch (err) {
    console.error(err);
  }
});

// photo detail page
app.get('/photos/:id', async (req, res) => {
  // console.log(req.params.id);
  const photo = await Photo.findById(req.params.id);
  res.render('photo', {
    photo,
  });
});

app.get('/about', (req, res) => {
  res.render('about');
});
app.get('/add', (req, res) => {
  res.render('add');
});

// create a photo
app.post('/photos', async (req, res) => {
  // console.log(req.body);
  // console.log(req.files.image)

  const uploadDir = 'public/uploads';
  // klasörün olup olmadığını kontrol etme
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir); // klasör yoksa oluştur
  }

  let uploadImage = req.files.image; // görsel bilgileri
  let uploadPath = __dirname + '/public/uploads/' + uploadImage.name; // görsellerin kaydedileceği yer

  // Yakaladığımız dosyayı .mv metodu ile yukarda belirlediğimiz path'a taşıma
  uploadImage.mv(uploadPath, async (err) => {
    if (err) console.log(err);
    await Photo.create({
      ...req.body,
      image: '/uploads/' + uploadImage.name,
    });
  });
  res.redirect('/');
});

// edit sayfasına yönlendirme
app.get('/photos/edit/:id', async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  res.render('edit', {
    photo,
  });
});

// bilgi güncelleme
app.put('/photos/:id', async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  photo.title = req.body.title;
  photo.description = req.body.description;
  photo.save();

  res.redirect(`/photos/${req.params.id}`);
});

app.delete('/photos/:id', async (req, res) => {
  // console.log(req.params.id);
  const photo = await Photo.findOne({ _id: req.params.id });
  let deletedImage = __dirname + '/public' + photo.image;
  fs.unlinkSync(deletedImage);
  await Photo.findOneAndRemove(req.params.id);
  res.redirect('/');
});

const port = 3000;

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
