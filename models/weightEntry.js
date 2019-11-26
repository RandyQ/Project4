// Require mongoose
let mongoose = require('mongoose');

// Create the schema for a 'weightEntry'
let weightEntrySchema = new mongoose.Schema({
    name: String,
    weight: Number,
    height: Number,
    date: String
});

module.exports = mongoose.model('WeightEntry', weightEntrySchema);