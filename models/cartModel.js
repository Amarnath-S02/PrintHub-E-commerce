const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({ // Link to user ID
  userName: String,
  productName: String,
  productImage: 
  {
    data: Buffer,
    contentType: String
  }, // Image URL or path
  productPrice: Number, // Price of the product
  productDescription: String,
  productQuantity: String // Description of the product
});

const CartItem = mongoose.model('CartItem', cartItemSchema);

module.exports = CartItem;