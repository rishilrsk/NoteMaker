import React from "react";
import { Card, Badge, Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaThumbtack, FaTrash, FaCopy, FaEllipsisV } from "react-icons/fa";

// Custom toggle (no changes)
const CustomToggle = React.forwardRef(({ onClick }, ref) => (
  <a
    href=""
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
    className="text-muted"
    style={{ textDecoration: "none" }}
  >
    <FaEllipsisV />
  </a>
));

// --- 1. REVISED FUNCTION TO GET TAG STYLE ---
// Define a list of softer, more readable color pairs
const tagStyles = [
  { backgroundColor: "#ffffffff", color: "#abdcf4ff", borderColor: "#00c8ffff" }, // Light Blue
 // Light Fuchsia
];

// Hash function to pick a style consistently
const getTagStyle = (tag) => {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % tagStyles.length;
  return tagStyles[index];
};
// --- END OF REVISED FUNCTION ---

function NoteCard({ note, onDelete, onPin, onDuplicate }) {
  const navigate = useNavigate();

  // getSnippet function (no changes)
  const getSnippet = (html) => {
    if (!html) return "";
    const doc = new DOMParser().parseFromString(html, "text/html");
    const text = doc.body.textContent || "";
    return text.length > 100 ? text.substring(0, 100) + "..." : text;
  };

  const snippet = getSnippet(note.content);

  const handleEdit = () => {
    navigate(`/editor/${note._id}`);
  };

  return (
    <Card
      className="h-100 shadow-sm note-card"
      style={{
        transition: "var(--app-transition)",
        transform: "translateY(0)",
      }}
      onMouseOver={(e) =>
        (e.currentTarget.style.transform = "translateY(-5px)")
      }
      onMouseOut={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    >
      {/* Card.Body and Dropdown (no changes) */}
      <Card.Body onClick={handleEdit} style={{ cursor: "pointer" }}>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <Card.Title className="mb-0">
            {note.isPinned && (
              <FaThumbtack size={12} className="text-warning me-2" />
            )}
            {note.title || "Untitled Note"}
          </Card.Title>
          <Dropdown onClick={(e) => e.stopPropagation()}>
            <Dropdown.Toggle as={CustomToggle} id="note-options" />
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => onPin(note._id)}>
                <FaThumbtack className="me-2" />{" "}
                {note.isPinned ? "Unpin" : "Pin"}
              </Dropdown.Item>
              <Dropdown.Item onClick={() => onDuplicate(note._id)}>
                <FaCopy className="me-2" /> Duplicate
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item
                onClick={() => onDelete(note._id)}
                className="text-danger"
              >
                <FaTrash className="me-2" /> Delete
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <Card.Text className="text-muted" style={{ fontSize: "0.9rem" }}>
          {snippet}
        </Card.Text>
      </Card.Body>

      {/* Card.Footer with updated Tags */}
      <Card.Footer
        onClick={handleEdit}
        style={{ cursor: "pointer", background: "transparent" }}
      >
        <div className="d-flex justify-content-between align-items-center">
          <small className="text-muted">
            {new Date(note.updatedAt).toLocaleDateString()}
          </small>
          <div>
            {/* --- 2. UPDATED TAG RENDERING WITH NEW STYLES --- */}
            {note.tags?.slice(0, 3).map((tag) => {
              // Get the unique style object for this tag
              const style = getTagStyle(tag);

              return (
                <Badge
                  pill
                  key={tag}
                  // Apply background, text color, and border from our function
                  style={{
                    backgroundColor: style.backgroundColor,
                    color: style.color,
                    border: `1px solid ${style.borderColor}`, // Add border for definition
                    padding: "0.3em 0.6em", // Adjust padding slightly
                  }}
                  // Use 'text-decoration-none' to prevent potential underlines if tag is a link later
                  className="me-1 fw-normal text-decoration-none"
                >
                  {tag}
                </Badge>
              );
            })}
          </div>
        </div>
      </Card.Footer>
    </Card>
  );
}

export default NoteCard;
