const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
  type: String,
  required: function () {
    return !this.googleId && !this.githubId;
  },
},
  googleId: {
    type: String,
    sparse: true, // Allows multiple null values
  },
  githubId: {
    type: String,
    sparse: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);