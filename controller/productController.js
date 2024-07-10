var fs = require('fs');
var path = require('path');
const Product = require('../models/productModel');
const Category = require('../models/categoryModel'); // Import the Category model



exports.getAddProduct = async (req, res) => {
  try {
    const categories = await Category.find({}, 'categoryName -_id'); // Assuming 'name' is the field with category names
    res.render('addproduct', { 
      message: req.flash('error'),
      categories: categories // Pass categories to the template
    });
  } catch (error) {
    req.flash('error', 'Error fetching categories');
    res.redirect('/addproduct');
  }
};


exports.postAddProduct = (req, res) => {
  const { productId, productName, categoryName, productPrice, productDescription } = req.body;

  Product.exists({ productId: productId })
    .then((exists) => {
      if (exists) {
        req.flash('error', 'Product ID already exists');
        return res.redirect('/addproduct');
      } else {
        const newProduct = new Product({
          productId: productId,
          productName: productName,
          categoryName: categoryName,
          productImage: {
            data: fs.readFileSync(path.join(__dirname + '../../uploads/' + req.file.filename)),
            contentType: 'image/png'
        }, // Assuming productImage is the URL/path of the image
          productPrice: productPrice, // Assuming productPrice is a number
          productDescription: productDescription // Description of the product
          // Other product details as needed
        });

        newProduct.save()
          .then(() => {
            req.flash('success', 'Product added successfully');
            return res.redirect('/addproduct');
          })
          .catch((err) => {
            req.flash('error', 'Error adding product');
            return res.redirect('/addproduct');
          });
      }
    })
    .catch((err) => {
      req.flash('error', 'Error checking product existence');
      return res.redirect('/addproduct');
    });
};


exports.getModifyProduct = async (req, res) => {
  try {
    // Render the modifyproduct.ejs page
    res.render('modifyproduct');
  } catch (error) {
    req.flash('error', 'Error rendering modify product page');
    res.redirect('/'); // Redirect to an appropriate page or handle it accordingly
  }
};

exports.getModifyProduct = async (req, res) => {
  try {
      const products = await Product.find({});

      res.render('modifyproduct', { products });
  } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).send('Error fetching products');
  }
};



// Express route handling deletion of products by ID
exports.deleteproduct = async (req, res) => {
  const productId = req.params.productId;
  try {
      
    const deletedproduct = await Product.findByIdAndDelete(productId);
    if (deletedproduct) {
        return res.status(200).send('Product deleted successfully');
    } else {
        return res.status(404).send('product not found');
    }// Your logic to delete the user with the provided userId
      // Example: await User.findByIdAndDelete(userId);
     // res.status(200).send('User deleted successfully');
  } catch (error) {
      console.error('Error deleting uproduct:', error);
      res.status(500).send('Server error');
  }
};

exports.updateProduct = async (req, res) => {
  const productId = req.params.productId; // Extract productId from the request parameters
    //console.log('Received product data:', req.body);

    // Log specific fields like productName and productDescription
    //console.log('Received productName:', req.body.productName);
    //console.log('Received productDescription:', req.body.productDescription);
  try {
      // Find the product by its ID in the database
      const productToUpdate = await Product.findByIdAndUpdate(productId, {
          // Update the fields you want to change
          productName: req.body.productName,
          categoryName: req.body.categoryName,
          productImage: req.body.productImage,
          productPrice: req.body.productPrice,
          productDescription: req.body.productDescription
          // Add more fields as needed
      }, { new: true }); // To get the updated product

      if (!productToUpdate) {
          return res.status(404).json({ message: 'Product not found' });
      }

      // Respond with the updated product
      res.status(200).json({ message: 'Product updated successfully', updatedProduct: productToUpdate });
  } catch (error) {
      // Handle errors and respond with an error message
      console.error('Error updating product:', error);
      res.status(500).json({ message: 'Failed to update product' });
  }
};


