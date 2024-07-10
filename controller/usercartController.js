
const CartItem = require('../models/cartModel');
const Product = require('../models/productModel');

// Assuming you have an Express.js app
// This is a simplified example; adjust this based on your actual setup

exports.getCartCount = async (req, res) => {
  // console.log(req);
  const { username } = req.session;
  // console.log(username);
  try {
      // Logic to fetch the count of products in the cart from your database
      // For example, if you're using MongoDB
      const cartCount = await CartItem.countDocuments({ userName: username }); // Fetch count from your cart collection

      res.json(cartCount); // Send the count as a JSON response
  } catch (error) {
      console.error('Error fetching cart count:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};


// Route to add product to the cart
exports.addToCart = async (req, res) => {
  const { productName } = req.params; // Get productId from the URL params
  const { username } = req.session;
  console.log(username);
  console.log(productName);
  try {
    // Find the product by productId
    const product = await Product.findOne({productName});
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Check if the product already exists in the cart
    let cartItem = await CartItem.findOne({ productName, userName: username });
    if (cartItem) {
      // If the product already exists in the cart, increase the quantity
      cartItem.productQuantity = Number(cartItem.productQuantity) + 1; // Convert to number and add 1
    } else {
      // Create a new CartItem instance if the product is not in the cart
      cartItem = new CartItem({
        productName: product.productName,
        productDescription: product.productDescription,
        productImage: product.productImage,
        productPrice: product.productPrice,
        productQuantity: 1,  // Set initial quantity to 1 for new items
        userName: username,
      });
    }

    // Save/update the cart item in the MongoDB collection
    const savedCartItem = await cartItem.save();

    res.status(201).json(savedCartItem); // Respond with the saved cart item
  } catch (err) {
    console.error('Error adding to cart:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.getCartItems = async (req, res) => {
  try {
    const username=req.session.username;
    // console.log('name',username);
      const cartitems = await CartItem.find({userName: username});
      let grandTotal = 0;
    cartitems.forEach(cart => {
        grandTotal += cart.productQuantity * cart.productPrice;
    });
      res.render('cart', { cartitems, grandTotal, username });
  } catch (error) {
      console.error('Error fetching cart:', error);
      res.status(500).send('Error fetching cart');
  }
};


exports.updateCartItemQuantity = async (req, res) => {
  const cartId = req.params.cartId;
  const newQuantity = req.body.quantity;

  try {
      // Find the cart item by ID
      const cartItem = await CartItem.findById(cartId);

      if (!cartItem) {
          return res.status(404).json({ message: 'Cart item not found' });
      }

      // Update the quantity
      cartItem.productQuantity = newQuantity;
      await cartItem.save();

      res.status(200).json({ message: 'Quantity updated successfully' });
  } catch (error) {
      console.error('Error updating quantity:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};

// Express route handling deletion of cartproducts by ID
exports.deleteCartItem = async (req, res) => {
  const cartId = req.params.cartId;
  try {
      
    const deletedproduct = await CartItem.findByIdAndDelete(cartId);
    if (deletedproduct) {
        return res.status(200).send('Cartproduct deleted successfully');
    } else {
        return res.status(404).send('cartproduct not found');
    }// Your logic to delete the user with the provided userId
      // Example: await User.findByIdAndDelete(userId);
     // res.status(200).send('User deleted successfully');
  } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).send('Server error');
  }
};

// DELETE route to delete all items from the cart
exports.deleteAllCartItems = async (req, res) => {
  try {
      // Delete all cart items
      await CartItem.deleteMany({});

      res.status(200).json({ message: 'All cart items deleted successfully' });
  } catch (error) {
      console.error('Error deleting cart items:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};