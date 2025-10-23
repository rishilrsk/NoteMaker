import React, { useState } from "react";
import { Form, Badge } from "react-bootstrap";
import { FaTimes } from "react-icons/fa";

/**
 * A simple component for inputting comma-separated tags
 */
function TagInput({ tags, setTags }) {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e) => {
    // On Enter or Comma, add the tag
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newTag = inputValue.trim().toLowerCase();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setInputValue("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div>
      <div className="mb-2">
        {tags.map((tag, index) => (
          <Badge pill bg="primary" className="me-2 p-2 fs-6" key={index}>
            {tag}
            <FaTimes
              className="ms-1"
              style={{ cursor: "pointer" }}
              onClick={() => removeTag(tag)}
            />
          </Badge>
        ))}
      </div>
      <Form.Control
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Add tags (press Enter or comma)"
      />
    </div>
  );
}

export default TagInput;
