import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Spinner,
  Alert,
  Card,
} from "react-bootstrap";
import { useEditor, EditorContent } from "@tiptap/react";

// Import Tiptap Extensions
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Strike from "@tiptap/extension-strike";
import Code from "@tiptap/extension-code";
import Blockquote from "@tiptap/extension-blockquote";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Placeholder from "@tiptap/extension-placeholder"; // For placeholder text

import api from "../services/api";
import "../styles/Editor.css"; // Import editor styles

// MenuBar Component
const MenuBar = ({ editor }) => {
  if (!editor) return null;

  const buttonStyle = {
    borderRadius: "var(--app-border-radius)",
    padding: "0.4rem 0.6rem",
  };

  return (
    <div className="editor-toolbar mb-3 p-2">
      <Button
        onClick={() => editor.chain().focus().toggleBold().run()}
        variant={editor.isActive("bold") ? "primary" : "outline-secondary"}
        className="me-1"
        size="sm"
        style={buttonStyle}
      >
        Bold
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        variant={editor.isActive("italic") ? "primary" : "outline-secondary"}
        className="me-1"
        size="sm"
        style={buttonStyle}
      >
        Italic
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        variant={editor.isActive("underline") ? "primary" : "outline-secondary"}
        className="me-1"
        size="sm"
        style={buttonStyle}
      >
        Underline
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        variant={editor.isActive("strike") ? "primary" : "outline-secondary"}
        className="me-1"
        size="sm"
        style={buttonStyle}
      >
        Strike
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleCode().run()}
        variant={editor.isActive("code") ? "primary" : "outline-secondary"}
        className="me-1"
        size="sm"
        style={buttonStyle}
      >
        Code
      </Button>
      <span className="editor-toolbar-divider mx-2"></span>
      <Button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        variant={
          editor.isActive("heading", { level: 2 })
            ? "primary"
            : "outline-secondary"
        }
        className="me-1"
        size="sm"
        style={buttonStyle}
      >
        H2
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        variant={
          editor.isActive("heading", { level: 3 })
            ? "primary"
            : "outline-secondary"
        }
        className="me-1"
        size="sm"
        style={buttonStyle}
      >
        H3
      </Button>
      <span className="editor-toolbar-divider mx-2"></span>
      <Button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        variant={
          editor.isActive("bulletList") ? "primary" : "outline-secondary"
        }
        className="me-1"
        size="sm"
        style={buttonStyle}
      >
        Bullet List
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        variant={
          editor.isActive("orderedList") ? "primary" : "outline-secondary"
        }
        className="me-1"
        size="sm"
        style={buttonStyle}
      >
        Ordered List
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        variant={
          editor.isActive("blockquote") ? "primary" : "outline-secondary"
        }
        className="me-1"
        size="sm"
        style={buttonStyle}
      >
        Blockquote
      </Button>
    </div>
  );
};

// Main Editor Component
const NoteEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Strike,
      Code,
      Blockquote,
      BulletList,
      OrderedList,
      ListItem,
      Placeholder.configure({
        // Configure placeholder text
        placeholder: "Start writing your note here...",
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "tiptap-editor",
      },
    },
  });

  // Fetch existing note effect (no changes)
  useEffect(() => {
    if (id) {
      setLoading(true);
      api
        .get(`/notes/${id}`)
        .then((res) => {
          const note = res.data;
          setTitle(note.title);
          setTags(note.tags.join(", "));
          setContent(note.content || ""); // Ensure content is not null/undefined
        })
        .catch((err) => setError("Failed to load note."))
        .finally(() => setLoading(false));
    } else {
      // Reset fields for new note
      setTitle("");
      setTags("");
      setContent("");
    }
  }, [id]);

  // Update editor effect (no changes)
  useEffect(() => {
    // Check if editor exists and content is different before setting
    if (editor && content !== editor.getHTML()) {
      // Use insertContent to avoid losing cursor position on initial load
      editor.commands.setContent(content, false, { preserveCursor: true });
    }
    // Only run when content changes *after* editor is initialized
  }, [content, editor]);

  // Handle save logic (added plainTextContent)
  const handleSave = async () => {
    setSaving(true);
    setError("");
    const noteData = {
      title: title || "Untitled Note",
      content,
      plainTextContent: editor?.getText() || "",
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    };

    try {
      if (id) {
        await api.put(`/notes/${id}`, noteData);
      } else {
        await api.post("/notes", noteData);
      }
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to save note.");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container fluid="lg" className="my-5">
      <Row className="justify-content-center">
        <Col xs={12} lg={10} xl={8}>
          <Card className="p-4 rounded-3 shadow-lg">
            <Card.Body>
              <h2 className="text-center mb-4">
                {id ? "Edit Note" : "Create New Note"}
              </h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={(e) => e.preventDefault()}>
                <Form.Group className="mb-3" controlId="title">
                  <Form.Label className="fw-bold">Title</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="My Awesome Note"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="form-control-custom"
                    style={{ borderRadius: "var(--app-border-radius)" }}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="editor">
                  <Form.Label className="fw-bold">Content</Form.Label>
                  {/* This line is where the error pointed */}
                  <MenuBar editor={editor} />
                  <EditorContent editor={editor} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="tags">
                  <Form.Label className="fw-bold">Tags</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="work, ideas, important (comma-separated)"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="form-control-custom"
                    style={{ borderRadius: "var(--app-border-radius)" }}
                  />
                </Form.Group>

                <div className="d-flex justify-content-end mt-4">
                  <Button
                    variant="outline-secondary"
                    className="me-2"
                    onClick={() => navigate("/dashboard")}
                    style={{ borderRadius: "var(--app-border-radius)" }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleSave}
                    disabled={saving || !editor} // Disable if editor not ready
                    style={{
                      borderRadius: "var(--app-border-radius)",
                      padding: "0.6rem 1rem",
                    }}
                  >
                    {saving ? (
                      <Spinner as="span" animation="border" size="sm" />
                    ) : (
                      "Save Note"
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default NoteEditor;
