const Photo = require('../models/Photo');
const fs = require('fs');

// req.query özelliği ile ilgili yönlendirmede bulunan sorgu parametrelerini yakalamayı sağlar.

exports.getAllPhotos = async (req, res) => {
  try {
    const page = req.query.page || 1; // başlangıç sayfası
    const photoPerPage = 3; // her sayfada gösterilecek resim sayısı
    const totalPhotos = await Photo.find().countDocuments(); // veritabanındaki tüm fotoğraflar
    const photos = await Photo.find({}) // her sayfada göstermek istediğimiz fotoğraf bilgisi
      .sort('-dateCreated') // sıralama
      .skip((page - 1) * photoPerPage) // her sayfanın kendi fotoğrafları
      .limit(photoPerPage); // her sayfadaki fotoğrafı sınırlama
    res.render('index', {
      photos: photos,
      current: page,
      pages: Math.ceil(totalPhotos / photoPerPage), // toplam sayfa sayısı
    });
    // console.log(photos);
  } catch (err) {
    console.error(err);
  }
};

exports.getPhoto = async (req, res) => {
  // console.log(req.params.id);
  const photo = await Photo.findById(req.params.id);
  res.render('photo', {
    photo,
  });
};

exports.createPhoto = async (req, res) => {
  // console.log(req.body);
  // console.log(req.files.image)

  const uploadDir = 'public/uploads';
  // klasörün olup olmadığını kontrol etme
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir); // klasör yoksa oluştur
  }

  let uploadImage = req.files.image; // görsel bilgileri
  let uploadPath = __dirname + '/../public/uploads/' + uploadImage.name; // görsellerin kaydedileceği yer

  // Yakaladığımız dosyayı .mv metodu ile yukarda belirlediğimiz path'a taşıma
  uploadImage.mv(uploadPath, async (err) => {
    if (err) console.log(err);
    await Photo.create({
      ...req.body,
      image: '/uploads/' + uploadImage.name,
    });
  });
  res.redirect('/');
};

exports.updatePhoto = async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  photo.title = req.body.title;
  photo.description = req.body.description;
  photo.save();

  res.redirect(`/photos/${req.params.id}`);
};

exports.deletePhoto = async (req, res) => {
  // console.log(req.params.id);
  const photo = await Photo.findOne({ _id: req.params.id });
  let deletedImage = __dirname + '/../public' + photo.image;
  fs.unlinkSync(deletedImage);
  await Photo.findOneAndRemove(req.params.id);
  res.redirect('/');
};
