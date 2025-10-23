const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Subdocument for version history
const VersionSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const NoteSchema = new Schema({
  // Associate note with a user
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
    default: "Untitled Note",
  },
  content: {
    type: String, // This will store the HTML from React-Quill
    default: "",
  },
  // For plain text operations like search and summary
  plainTextContent: {
    type: String,
    default: "",
  },
  tags: {
    type: [String],
    default: [],
  },
  color: {
    type: String, // Hex code or Bootstrap color name (e.g., 'primary', 'warning')
    default: "light", // Default Bootstrap card color
  },
  isPinned: {
    type: Boolean,
    default: false,
  },
  isArchived: {
    type: Boolean,
    default: false,
  },
  versions: {
    type: [VersionSchema],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Note", NoteSchema);
