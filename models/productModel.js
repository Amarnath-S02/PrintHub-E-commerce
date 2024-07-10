
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    unique: true // Ensures productId is unique in the collection
  },
  categoryName: String,
  productName: String,
  productImage: {
    data: Buffer,
    contentType: String
  }, // Image URL or path
  productPrice: Number, // Price of the product
  productDescription: String // Description of the product
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;