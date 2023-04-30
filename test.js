const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// connect DB
mongoose
  .connect('mongodb://127.0.0.1:27017/pcat-test-db', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Successfully Connected'))
  .catch((err) => console.error(err));

// create Schema
const PhotoSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: '',
  },
});

const Photo = mongoose.model('Photo', PhotoSchema); // model oluşturma

// create a photo
Photo.create({
  title: 'Photo 1',
  desc: 'photo desc',
});

// read a photo
Photo.find({}).then((data) => {
  console.log(data);
});

async function readData() {
  try {
    const data = await Photo.find({});
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}

readData()

// update photo
const updateData = async (id) => {
    try {
        const updatedResult =
            await Photo.findByIdAndUpdate(
                { _id: id },
                {
                    title: "Software Engineer",
                    desc: "25"
                },
                {new: true} // güncellenen datayı görme
             );
         console.log(updatedResult);
     } catch (error) {
         console.log(error);
     }
 };

updateData("644e2c52714c8df77f823217");

const id = '644e2c52714c8df77f823217';
Photo.findByIdAndDelete({ _id: id })
  .then(function () {
    console.log('Data deleted'); // Success
  })
  .catch(function (error) {
    console.log(error); // Failure
  });
