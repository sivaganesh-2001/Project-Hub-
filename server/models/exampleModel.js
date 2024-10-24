// models/ExampleModel.js
const mongoose = require('mongoose');

const ExampleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  // Add other fields as needed
});

module.exports = mongoose.model('Example', ExampleSchema);
