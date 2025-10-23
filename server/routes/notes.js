const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const auth = require("../middleware/auth");
const noteController = require("../controllers/noteController");

// All routes in this file are protected by the 'auth' middleware
router.use(auth);

/**
 * @route   GET /api/notes
 * @desc    Get all notes for the logged-in user
 * @access  Private
 */
router.get("/", noteController.getAllNotes);

/**
 * @route   POST /api/notes
 * @desc    Create a new note
 * @access  Private
 */
router.post(
  "/",
  [check("title", "Title is required").not().isEmpty()],
  noteController.createNote
);

/**
 * @route   GET /api/notes/:id
 * @desc    Get a single note by ID
 * @access  Private
 */
router.get("/:id", noteController.getNoteById);

/**
 * @route   PUT /api/notes/:id
 * @desc    Update a note (and create a version)
 * @access  Private
 */
router.put("/:id", noteController.updateNote);

/**
 * @route   DELETE /api/notes/:id
 * @desc    Delete a note
 * @access  Private
 */
router.delete("/:id", noteController.deleteNote);

/**
 * @route   POST /api/notes/:id/duplicate
 * @desc    Duplicate a note
 * @access  Private
 */
router.post("/:id/duplicate", noteController.duplicateNote);

/**
 * @route   GET /api/notes/:id/versions
 * @desc    Get all versions for a single note
 * @access  Private
 */
router.get("/:id/versions", noteController.getNoteVersions);

/**
 * @route   POST /api/notes/:id/versions/:versionId/restore
 * @desc    Restore a note to a previous version
 * @access  Private
 */
router.post(
  "/:id/versions/:versionId/restore",
  noteController.restoreNoteVersion
);

/**
 * @route   POST /api/notes/:id/summarize
 * @desc    Get a mock AI summary for a note
 * @access  Private
 */
router.post("/:id/summarize", noteController.summarizeNote);

module.exports = router;
