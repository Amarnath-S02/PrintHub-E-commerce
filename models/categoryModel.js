const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  categoryID: {
    type: String,
    required: true,
    unique: true // Ensures categoryID is unique in the collection
  },
  categoryName: String,
  categoryImage: String // Image URL or path
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;