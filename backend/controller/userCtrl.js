// controllers/userCtrl.js
const User = require("../models/usermodel.js");

const getUserById = async (req, res) => {
  try {
    const {userId} = req.body; 

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getUserCount = async (req, res) => {
  try {
    // Get the count of all users
    const userCount = await User.countDocuments(); 
    
    res.json({ count: userCount });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getUserById,getUserCount };


