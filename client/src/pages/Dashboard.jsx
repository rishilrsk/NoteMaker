import React, { useState, useEffect, useMemo } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  InputGroup,
  Spinner,
  Alert,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaSearch } from "react-icons/fa";
import NoteCard from "../components/NoteCard.jsx";
import api from "../services/api.js";

function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // --- API Functions ---
  const getNotes = () => api.get("/notes");
  const deleteNote = (id) => api.delete(`/notes/${id}`);
  const updateNote = (id, data) => api.put(`/notes/${id}`, data);
  const duplicateNote = (id) => api.post(`/notes/${id}/duplicate`);
  // ---------------------

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const res = await getNotes();
      const sortedData = res.data.sort(
        (a, b) =>
          b.isPinned - a.isPinned ||
          new Date(b.updatedAt) - new Date(a.updatedAt)
      );
      setNotes(sortedData);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to fetch notes. Are you logged in?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Memoized filtered notes
  const filteredNotes = useMemo(() => {
    if (!notes) return [];
    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (note.plainTextContent &&
          note.plainTextContent
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        (note.tags &&
          note.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          ))
    );
  }, [notes, searchTerm]);

  // --- Note Actions ---
  const handleNoteDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        await deleteNote(id);
        setNotes(notes.filter((note) => note._id !== id));
      } catch (err) {
        console.error(err);
        setError("Failed to delete note.");
      }
    }
  };

  const handleNotePin = async (id) => {
    const note = notes.find((n) => n._id === id);
    try {
      const { data } = await updateNote(id, { isPinned: !note.isPinned });
      setNotes(
        notes
          .map((n) => (n._id === id ? data : n))
          .sort(
            (a, b) =>
              b.isPinned - a.isPinned ||
              new Date(b.updatedAt) - new Date(a.updatedAt)
          )
      );
    } catch (err) {
      console.error(err);
      setError("Failed to pin note.");
    }
  };

  const handleNoteDuplicate = async (id) => {
    try {
      const { data } = await duplicateNote(id);
      setNotes([data, ...notes]);
    } catch (err) {
      console.error(err);
      setError("Failed to duplicate note.");
    }
  };

  // 1. handleNoteArchive function has been REMOVED

return (
    <Container fluid="lg" className="my-4">
      {/* 1. UPDATED HEADER ROW */}
      <Row className="mb-4"> {/* Removed align-items-center for now */}
        {/* 2. MAKE THIS COLUMN WIDER (e.g., md={8} or md={9}) */}
        <Col md={8}> 
          {/* 3. USE D-FLEX TO PUT ITEMS SIDE-BY-SIDE */}
          <div className="d-flex align-items-center">
            {/* Search Bar */}
            <InputGroup className="me-3"> {/* Added margin-end */}
              <InputGroup.Text className="input-icon-prepend">
                <FaSearch />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search notes..." // Shortened placeholder
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-control-custom"
                style={{ height: '50px' }} 
              />
            </InputGroup>
            
            {/* Create Button (Now in the same flex container) */}
            <Button 
              variant="primary" 
              onClick={() => navigate("/editor")}
              style={{ height: '50px', fontSize: '1rem', borderRadius: 'var(--app-border-radius)', whiteSpace: 'nowrap' }} // Added whiteSpace
            >
              <FaPlus className="me-2" /> Create Note {/* Shortened text */}
            </Button>
          </div>
        </Col>
        {/* 4. The second Col for the button is REMOVED */}
      </Row>

      {/* --- Rest of the component remains the same --- */}
      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" role="status">
            <span className="visually-hidden">Loading notes...</span>
          </Spinner>
        </div>
      ) : (
        <>
          {filteredNotes.length === 0 ? (
            <div className="text-center text-muted py-5">
              <h4>
                {searchTerm
                  ? "No notes match your search."
                  : "No notes found. Create one to get started!"}
              </h4>
            </div>
          ) : (
            <>
              {filteredNotes.some((n) => n.isPinned) && (
                <>
                  <h5 className="text-muted fw-bold text-uppercase small mb-3">Pinned</h5>
                  <Row xs={1} md={2} lg={3} xl={4} className="g-4">
                    {filteredNotes
                      .filter((n) => n.isPinned)
                      .map((note) => (
                        <Col key={note._id}>
                          <NoteCard
                            note={note}
                            onDelete={handleNoteDelete}
                            onPin={handleNotePin}
                            onDuplicate={handleNoteDuplicate}
                          />
                        </Col>
                      ))}
                  </Row>
                  <hr className="my-4" style={{ borderColor: 'var(--app-border)' }} />
                </>
              )}

              <h5 className="text-muted fw-bold text-uppercase small mb-3">Notes</h5>
              <Row xs={1} md={2} lg={3} xl={4} className="g-4">
                {filteredNotes
                  .filter((n) => !n.isPinned)
                  .map((note) => (
                    <Col key={note._id}>
                      <NoteCard
                        note={note}
                        onDelete={handleNoteDelete}
                        onPin={handleNotePin}
                        onDuplicate={handleNoteDuplicate}
                      />
                    </Col>
                  ))}
              </Row>
            </>
          )}
        </>
      )}
    </Container>
  );
}

export default Dashboard;
