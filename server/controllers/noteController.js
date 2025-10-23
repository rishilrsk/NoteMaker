const Note = require("../models/Note");
const { validationResult } = require("express-validator");

// Helper function to extract plain text from Quill's HTML
const extractPlainText = (html) => {
  if (!html) return "";
  return html.replace(/<[^>]+>/g, " "); // Simple regex to strip HTML tags
};

// Helper function for Mock AI Summary
const generateMockSummary = (text) => {
  if (!text || text.trim().length === 0) {
    return { summary: "No content to summarize.", keywords: [] };
  }

  // 1. Generate Summary (first 3 sentences)
  const sentences = text.split(". ").filter((s) => s.length > 0);
  const summary =
    sentences.slice(0, 3).join(". ") + (sentences.length > 0 ? "." : "");

  // 2. Extract Keywords (simple version)
  const stopWords = new Set([
    "i",
    "me",
    "my",
    "myself",
    "we",
    "our",
    "ours",
    "ourselves",
    "you",
    "your",
    "yours",
    "yourself",
    "yourselves",
    "he",
    "him",
    "his",
    "himself",
    "she",
    "her",
    "hers",
    "herself",
    "it",
    "its",
    "itself",
    "they",
    "them",
    "their",
    "theirs",
    "themselves",
    "what",
    "which",
    "who",
    "whom",
    "this",
    "that",
    "these",
    "those",
    "am",
    "is",
    "are",
    "was",
    "were",
    "be",
    "been",
    "being",
    "have",
    "has",
    "had",
    "having",
    "do",
    "does",
    "did",
    "doing",
    "a",
    "an",
    "the",
    "and",
    "but",
    "if",
    "or",
    "because",
    "as",
    "until",
    "while",
    "of",
    "at",
    "by",
    "for",
    "with",
    "about",
    "against",
    "between",
    "into",
    "through",
    "during",
    "before",
    "after",
    "above",
    "below",
    "to",
    "from",
    "up",
    "down",
    "in",
    "out",
    "on",
    "off",
    "over",
    "under",
    "again",
    "further",
    "then",
    "once",
    "here",
    "there",
    "when",
    "where",
    "why",
    "how",
    "all",
    "any",
    "both",
    "each",
    "few",
    "more",
    "most",
    "other",
    "some",
    "such",
    "no",
    "nor",
    "not",
    "only",
    "own",
    "same",
    "so",
    "than",
    "too",
    "very",
    "s",
    "t",
    "can",
    "will",
    "just",
    "don",
    "should",
    "now",
  ]);

  const wordCounts = {};
  const words = text
    .toLowerCase()
    .replace(/[.,!?;:()]/g, "")
    .split(/\s+/);

  words.forEach((word) => {
    if (word.length > 3 && !stopWords.has(word)) {
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    }
  });

  const keywords = Object.keys(wordCounts)
    .sort((a, b) => wordCounts[b] - wordCounts[a])
    .slice(0, 5); // Get top 5 keywords

  return { summary, keywords };
};

/**
 * @desc    Get all notes for the logged-in user
 * @route   GET /api/notes
 * @access  Private
 */
exports.getAllNotes = async (req, res) => {
  try {
    // Find notes, filtering out archived by default
    // Sort by pinned status first, then by last updated
    const notes = await Note.find({
      user: req.user.id,
      isArchived: false,
    }).sort({ isPinned: -1, updatedAt: -1 });

    res.json(notes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * @desc    Create a new note
 * @route   POST /api/notes
 * @access  Private
 */
exports.createNote = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, content, tags, color } = req.body;

  try {
    const newNote = new Note({
      user: req.user.id,
      title: title || "Untitled Note",
      content: content || "",
      plainTextContent: extractPlainText(content),
      tags: tags || [],
      color: color || "light",
    });

    const note = await newNote.save();
    res.status(201).json(note);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * @desc    Get a single note by ID
 * @route   GET /api/notes/:id
 * @access  Private
 */
exports.getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ msg: "Note not found" });
    }

    // Check if user owns the note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    res.json(note);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Note not found" });
    }
    res.status(500).send("Server Error");
  }
};

/**
 * @desc    Update a note (and create a version)
 * @route   PUT /api/notes/:id
 * @access  Private
 */
exports.updateNote = async (req, res) => {
  const { title, content, tags, color, isPinned, isArchived } = req.body;

  try {
    let note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ msg: "Note not found" });
    }

    // Check user ownership
    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    // --- Versioning ---
    // Check if content has meaningfully changed before creating a version
    const oldContent = note.content;
    const newContent = content;

    // We only create a version if the content has changed.
    // We don't version changes to title, tags, color, etc.
    if (newContent !== undefined && oldContent !== newContent) {
      // Create a new version from the *current* content
      const newVersion = {
        content: oldContent,
        timestamp: note.updatedAt || note.createdAt,
      };

      // Add the new version and cap the array at 20
      note.versions.push(newVersion);
      if (note.versions.length > 20) {
        // Keep the 20 most recent versions
        note.versions = note.versions.slice(note.versions.length - 20);
      }
    }

    // --- Update Fields ---
    if (title !== undefined) note.title = title;
    if (content !== undefined) {
      note.content = content;
      note.plainTextContent = extractPlainText(content); // Update plain text
    }
    if (tags !== undefined) note.tags = tags;
    if (color !== undefined) note.color = color;
    if (isPinned !== undefined) note.isPinned = isPinned;
    if (isArchived !== undefined) note.isArchived = isArchived;

    note.updatedAt = Date.now();

    const updatedNote = await note.save();
    res.json(updatedNote);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * @desc    Delete a note
 * @route   DELETE /api/notes/:id
 * @access  Private
 */
exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ msg: "Note not found" });
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    await Note.findByIdAndDelete(req.params.id);

    res.json({ msg: "Note removed" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Note not found" });
    }
    res.status(500).send("Server Error");
  }
};

/**
 * @desc    Duplicate a note
 * @route   POST /api/notes/:id/duplicate
 * @access  Private
 */
exports.duplicateNote = async (req, res) => {
  try {
    const originalNote = await Note.findById(req.params.id);

    if (!originalNote) {
      return res.status(4404).json({ msg: "Note not found" });
    }

    if (originalNote.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    const newNote = new Note({
      user: req.user.id,
      title: `${originalNote.title} (Copy)`,
      content: originalNote.content,
      plainTextContent: originalNote.plainTextContent,
      tags: [...originalNote.tags],
      color: originalNote.color,
      isPinned: false, // Don't pin the copy
      isArchived: false,
    });

    // We don't copy the version history

    const duplicatedNote = await newNote.save();
    res.status(201).json(duplicatedNote);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * @desc    Get all versions for a single note
 * @route   GET /api/notes/:id/versions
 * @access  Private
 */
exports.getNoteVersions = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id).select("versions user");

    if (!note) {
      return res.status(404).json({ msg: "Note not found" });
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    // Return versions in descending order (newest first)
    res.json(note.versions.sort((a, b) => b.timestamp - a.timestamp));
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * @desc    Restore a note to a previous version
 * @route   POST /api/notes/:id/versions/:versionId/restore
 * @access  Private
 */
exports.restoreNoteVersion = async (req, res) => {
  try {
    let note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ msg: "Note not found" });
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    // Find the specific version
    const versionToRestore = note.versions.id(req.params.versionId);
    if (!versionToRestore) {
      return res.status(404).json({ msg: "Version not found" });
    }

    // 1. Create a *new* version from the *current* content
    const newVersion = {
      content: note.content,
      timestamp: note.updatedAt,
    };
    note.versions.push(newVersion);
    if (note.versions.length > 20) {
      note.versions = note.versions.slice(note.versions.length - 20);
    }

    // 2. Restore the old content
    note.content = versionToRestore.content;
    note.plainTextContent = extractPlainText(versionToRestore.content);
    note.updatedAt = Date.now();

    // 3. Remove the restored version from the history (optional,
    // but prevents clutter. Or we can keep it.)
    // Let's keep it for a full history.

    const updatedNote = await note.save();
    res.json(updatedNote);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * @desc    Get a mock AI summary for a note
 * @route   POST /api/notes/:id/summarize
 * @access  Private
 */
exports.summarizeNote = async (req, res) => {
  try {
    // We can also just receive the text from the client
    // to summarize unsaved changes. Let's do that.
    const { text } = req.body;

    // Or, if no text is provided, get it from the saved note
    if (!text) {
      const note = await Note.findById(req.params.id);
      if (!note) {
        return res.status(404).json({ msg: "Note not found" });
      }
      if (note.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: "Not authorized" });
      }
      const summary = generateMockSummary(note.plainTextContent);
      return res.json(summary);
    }

    // If text is provided in the body (e.g., from editor state):
    const summary = generateMockSummary(text);
    res.json(summary);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
