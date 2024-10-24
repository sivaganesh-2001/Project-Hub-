import React, { useState } from 'react';
import '../../../styles/Hod/RemoveFaculty.css';

const RemoveFaculty = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Handle removing the faculty by email
  const handleRemove = async () => {
    setMessage('');
    setError('');

    if (!email) {
      setError('Email is required');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/faculty/delete`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`, // Add the Bearer token
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }) // Send email in the request body
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to remove faculty');
      }

      setMessage(`Faculty with email ${email} removed successfully`);
      setEmail('');
      setConfirmDelete(false);
    } catch (error) {
      setError(error.message || 'An error occurred while removing the faculty');
    }
  };

  return (
    <div className="manage-faculty-remove">
      <h2>Remove Faculty</h2>

      {/* Input for Email */}
      <input
        type="email"
        placeholder="Enter Faculty Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={error ? 'error' : ''}
      />

      {/* Delete Button */}
      {!confirmDelete ? (
        <div className="faculty-actions">
          <button className="delete-btn" onClick={() => setConfirmDelete(true)}>Delete Faculty</button>
        </div>
      ) : (
        <div className="confirm-delete">
          <p>Are you sure you want to delete the faculty with email {email}?</p>
          <button className="confirm-btn" onClick={handleRemove}>Yes, Delete</button>
          <button className="cancel-btn" onClick={() => setConfirmDelete(false)}>Cancel</button>
        </div>
      )}

      {/* Error message */}
      {error && <div className="error-message">{error}</div>}

      {/* Success message */}
      {message && <div className="success-message">{message}</div>}
    </div>
  );
};

export default RemoveFaculty;
