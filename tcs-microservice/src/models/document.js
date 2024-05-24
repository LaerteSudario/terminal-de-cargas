const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  filename: { type: String, required: true },
  contentFile: { type: Object, required: true }
});

const Document = mongoose.model('Document', documentSchema);

module.exports = Document;

