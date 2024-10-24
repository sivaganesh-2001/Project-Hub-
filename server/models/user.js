const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Counter = require('./counter'); // Ensure path is correct

const UserSchema = new mongoose.Schema({
  userID: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  roles: {
    type: [String], // Array of strings to store roles
    enum: ['projectGuide', 'projectIncharge', 'student', 'admin', 'projectPanel','tutor','hod'], // Restrict the roles to these values
    default: ['student'], // Default role if not provided
  },
});

// Pre-save middleware to hash password and generate userID
UserSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    // Hash the password
    this.password = await bcrypt.hash(this.password, 10);

    // Generate auto-incremented userID
    if (!this.userID) {
      const counter = await Counter.findOneAndUpdate(
        { name: 'userID' },             // Look for the counter document
        { $inc: { sequenceValue: 1 } }, // Increment the sequence value by 1
        { new: true, upsert: true }     // Create the document if it doesn't exist
      );

      // Ensure that counter and sequenceValue are valid
      if (!counter || !counter.sequenceValue) {
        throw new Error('Counter document not found or created.');
      }

      // Format the userID as 'USER001', 'USER002', etc.
      this.userID = `USER${String(counter.sequenceValue).padStart(3, '0')}`;
    }

    next();
  } catch (err) {
    // Pass any errors to the next middleware
    next(err);
  }
});

// Method to compare password for login
UserSchema.methods.matchPassword = async function (enteredPassword) {
  // Compare the entered password with the hashed password stored in the database
  return await bcrypt.compare(enteredPassword, this.password);
};

// Create the model and specify the collection name explicitly
const User = mongoose.models.User || mongoose.model('User', UserSchema);

module.exports = User;
