const express = require('express');
const router = express.Router();

// Simulated admin credentials (for demonstration purposes)
const adminCredentials = {
  username: 'admin',
  password: 'admin@123'
};

router.get('/adminlogin', (req, res) => {
  res.render('adminlogin', { message: req.flash('error') });
});

router.post('/adminlogin', (req, res) => {
  const { adminUsername, adminPassword } = req.body;

  // Check if provided credentials match admin credentials
  if (adminUsername === adminCredentials.username && adminPassword === adminCredentials.password) {
    // Admin authentication successful
    req.session.isAdminLoggedIn = true;
    return res.redirect('/admindashboard');
  } else {
    // If admin credentials are incorrect
    req.flash('error', 'Invalid admin credentials');
    return res.redirect('/adminlogin');
  }
});

const isAdminLoggedIn = (req, res, next) => {
  if (req.session.isAdminLoggedIn) {
    return next();
  } else {
    return res.redirect('/adminlogin');
  }
};

router.get('/admindashboard', isAdminLoggedIn, (req, res) => {
  res.render('admindashboard');
});


router.get('/adminlogout', (req, res) => {
  req.session.isAdminLoggedIn = false; // Clear the admin login status
  res.redirect('/adminlogin'); // Redirect to the admin login page
});

module.exports = router;
