const User = require('../models/User');

exports.getmanageuser = async (req, res) => {
    try {
        const users = await User.find({}, 'username phonenumber email');
        res.render('manageuser', { users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Error fetching users');
    }
 };
 

// Express route handling deletion of users by ID
exports.deleteUser = async (req, res) => {
  const userId = req.params.userId;
  try {
      
    const deletedUser = await User.findByIdAndDelete(userId);
    if (deletedUser) {
        return res.status(200).send('User deleted successfully');
    } else {
        return res.status(404).send('User not found');
    }// Your logic to delete the user with the provided userId
      // Example: await User.findByIdAndDelete(userId);
     // res.status(200).send('User deleted successfully');
  } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).send('Server error');
  }
};


