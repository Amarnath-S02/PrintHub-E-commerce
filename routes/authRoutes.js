// authRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Product = require('../models/productModel');
const AddToCart = require('../models/cartModel');

router.get('/shop', async (req, res) => {
  try {
    const username = req.session.username;
    const products = await Product.find({});
    console.log(products);
    res.render('shop', { username,products, message: req.flash('error') });
  } catch (error) {
    // Handle errors appropriately
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});
router.get('/shop', (req, res) => {
    res.render('shop', { message: req.flash('error') });
});

router.get('/productpage/:productid', async (req, res) => {
  try {
      const username = req.session.username;
      
      const productId = req.params.productid; // Use params instead of query for URL parameters
      console.log(productId);
      
      // Fetch product based on the received product ID from the database
      const product = await Product.findOne({ _id: productId }).exec();


      // Log the values before rendering the view
      // Render the product page with the fetched product
      res.render('productdesc', { product,username}); // Pass product details to your product view
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
  }
});


const cartController = require('../controller/usercartController.js');
const CartItem = require('../models/cartModel');
router.get('/cart', cartController.getCartItems);
router.get('/cart-count', cartController.getCartCount);
router.post('/add-to-cart/:productName', cartController.addToCart);
router.delete('/deletecartproduct/:cartId', cartController.deleteCartItem);
router.delete('/deleteAllCartItems/:cartId', cartController.deleteAllCartItems);
router.put('/updateCartItem/:cartId', cartController.updateCartItemQuantity);

const Order = require('../models/Order.js'); // Make sure to replace '<path-to-your-Order-model>' with the actual path to your Order model

// Route to handle order placement without a request body
router.post('/order', async (req, res) => {
    try {
        // Generate a unique order ID (you may use a library like 'uuid')
        const username = req.session.username;
        const cartitems = await CartItem.find({ userName: username });
        const user = await User.findOne({ username: username });
        let grandTotal = 0;

        const orderItems = cartitems.map(cart => ({
            productName: cart.productName,
            productQuantity: cart.productQuantity,
            productPrice: cart.productPrice,
        }));

        cartitems.forEach(cart => {
            grandTotal += cart.productQuantity * cart.productPrice;
        });

        const orderID = generateUniqueOrderID();

        // Create an order document with the order details
        const orderDetails = {
            orderID,
            username: user.username,
            email: user.email,
            orderItems,
            grandTotal,
            // Add other order details as needed
        };

        // Call a function to store the order details in the database
        const result = await Order.create(orderDetails);

        // Delete items from the cart after placing the order
        await CartItem.deleteMany({ userName: username });

        res.status(201).json({ orderID, message: 'Order placed successfully' });
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Function to generate a unique order ID (you can replace it with your own logic)
function generateUniqueOrderID() {
    // Implement your logic to generate a unique order ID (e.g., using a library like 'uuid')
    return 'ORD-' + Math.floor(Math.random() * 1000000);
}



router.get('/cart', async (req, res) => {
  try{
    const username=req.session.username;

    const cartitems=await CartItem.find({username: username});
    let grandTotal=0;
    cartitems.forEach(cart=>{
      grandTotal+=cart.productQuantity*cart.productPrice;
    });
    res.render('cart',{cartitems,grandTotal,username});
  }catch(error)
  {
    console.log('Error fetching cart:',error);
    res.status(500).send('Error fetching cart');
  }
});

// Add the route to fetch and display order history
router.get('/order-history', async (req, res) => {
  try {
      // Get the username from the session
      const username = req.session.username;

      // Fetch the user's orders from the database
      const orders = await Order.find({ username }).sort({ createdAt: -1 });

      // Render the orderHistory.ejs file with the orders
      res.render('orderHistory', { username, orders });
  } catch (error) {
      console.error('Error fetching order history:', error);
      req.flash('error', 'Error fetching order history');
      res.redirect('/'); // Redirect to the home page or handle the error as needed
  }
});


router.get('/blog', (req, res) => {
    const username = req.session.username;
    res.render('blog', { username,message: req.flash('error') });
});

router.get('/about', (req, res) => {
    const username = req.session.username;
    res.render('about', { username,message: req.flash('error') });
});

router.get('/contact', (req, res) => {
    const username = req.session.username;
    res.render('contact', { username,message: req.flash('error') });
});

router.get('/signup', (req, res) => {
  res.render('signup', { message: req.flash('error') });
});

router.post('/signup', async (req, res) => {
  // Signup logic remains the same
  try {
    const { username, password, email, phonenumber } = req.body;

    // Check if the username already exists
    const existingUser = await User.findOne({  email });

    if (existingUser) {
      req.flash('error', 'Username or email already exists. Please choose a different username or email.');
      return res.redirect('/signup');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({
      username,
      password: hashedPassword,
      email,
      phonenumber,
    });

    // Save the user to the database
    await user.save();

    // Redirect to login after successful signup
    res.redirect('/login');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/login', (req, res) => {
  res.render('login', { message: req.flash('error') });
});

router.post('/login', async (req, res) => {
  // Login logic remains the same
  try {
    const { email, password } = req.body;

    // Find the user by username
    const user = await User.findOne({ email });

    if (!user) {
      req.flash('error', 'Invalid username or password');
      return res.redirect('/login');
    }

    // Check the password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      req.flash('error', 'Invalid username or password');
      return res.redirect('/login');
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, 'secret_key', { expiresIn: '1h' });

    // Set the token in the cookie
    res.cookie('token', token);

    // Redirect to the index page after successful login
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

const authenticateToken = async (req, res, next) => {
  // Authentication middleware logic remains the same
  const token = req.cookies.token;

  if (!token) {
    return res.redirect('/login');
  }

  jwt.verify(token, 'secret_key', async (err, decoded) => {
    if (err) {
      return res.redirect('/login');
    }

    try {
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.redirect('/login');
      }

      req.user = { userId: decoded.userId, username: user.username };
      next();
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
};

router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
});

router.get('/signup', (req, res) => {
  res.redirect('/signup');
});

router.get('/', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).exec();
    const products = await Product.find({});
    console.log(products);

    if (!user) {
      return res.redirect('/login');
    }

    req.session.username=user.username;
    // Pass the username to the index page rendering
    res.render('index', { username: user.username ,products});
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
