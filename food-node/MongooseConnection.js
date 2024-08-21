var mongoose = require("mongoose");

async function connection() {
  await mongoose.connect("mongodb://127.0.0.1:27017/dbPri");

  const ProductSch = new mongoose.Schema({
    imgpath: {
      type: String,
    },
    fname: {
      type: String,
    },
    position: {
      type: String,
    },
    details: {
      type: String,
    },
  });
  return mongoose.models.imgChefs||mongoose.model("imgChefs", ProductSch);

}

module.exports = connection;
