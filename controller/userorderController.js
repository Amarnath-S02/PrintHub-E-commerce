
//userorderController.js
const Order = require('../models/Order');
exports.getMyOrders = async (req, res) => {
  const username = req.session.username;
    // console.log('name',username);
    try {
      const orders = await Order.find({ name: username }).sort({ purchaseDate: -1 });
      console.log(orders);
        res.render('myorders', { orders, username });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send('Error fetching products');
  }
};

