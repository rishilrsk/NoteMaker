import React, { useState, useEffect } from "react";
import { Modal, Button, ListGroup, Alert, Spinner } from "react-bootstrap";
import { getNoteVersions, restoreNoteVersion } from "../services/api";
import ReactQuill from "react-quill";

function VersionModal({ show, handleClose, noteId, onRestore }) {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedVersion, setSelectedVersion] = useState(null);

  useEffect(() => {
    if (show) {
      // Reset state on open
      setVersions([]);
      setSelectedVersion(null);
      setError("");

      const fetchVersions = async () => {
        setLoading(true);
        try {
          const res = await getNoteVersions(noteId);
          setVersions(res.data);
          if (res.data.length > 0) {
            setSelectedVersion(res.data[0]); // Select the most recent
          }
        } catch (err) {
          console.error(err);
          setError("Failed to load version history.");
        } finally {
          setLoading(false);
        }
      };
      fetchVersions();
    }
  }, [show, noteId]);

  const handleRestore = async () => {
    if (!selectedVersion) return;

    if (
      window.confirm(
        "This will save the current content as a new version and restore the selected version. Continue?"
      )
    ) {
      try {
        const res = await restoreNoteVersion(noteId, selectedVersion._id);
        onRestore(res.data); // Pass the fully updated note back
        handleClose();
      } catch (err) {
        console.error(err);
        setError("Failed to restore version.");
      }
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title>Version History</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {loading && (
          <div className="text-center">
            <Spinner animation="border" />
          </div>
        )}

        {!loading && versions.length === 0 && (
          <p>No previous versions found for this note.</p>
        )}

        {!loading && versions.length > 0 && (
          <div className="row">
            <div
              className="col-md-4"
              style={{ maxHeight: "60vh", overflowY: "auto" }}
            >
              <ListGroup>
                {versions.map((version) => (
                  <ListGroup.Item
                    key={version._id}
                    action
                    active={
                      selectedVersion && selectedVersion._id === version._id
                    }
                    onClick={() => setSelectedVersion(version)}
                  >
                    Saved at: {new Date(version.timestamp).toLocaleString()}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
            <div className="col-md-8">
              {selectedVersion ? (
                <div
                  className="border p-3 rounded"
                  style={{ maxHeight: "60vh", overflowY: "auto" }}
                >
                  <ReactQuill
                    value={selectedVersion.content}
                    readOnly={true}
                    theme="bubble"
                  />
                </div>
              ) : (
                <p>Select a version to preview.</p>
              )}
            </div>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button
          variant="primary"
          onClick={handleRestore}
          disabled={!selectedVersion}
        >
          Restore This Version
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default VersionModal;
