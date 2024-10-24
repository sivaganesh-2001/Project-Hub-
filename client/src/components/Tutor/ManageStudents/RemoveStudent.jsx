import React, { useState } from 'react';
import axios from 'axios';
import '../../../styles/Tutor/RemoveStudent.css';

const RemoveStudent = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Handle removing the student by email
  const handleRemove = async () => {
    setMessage('');
    setError('');

    if (!email) {
      setError('Email is required');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete('http://localhost:5000/api/faculty/delete', {
        data: { email },
      }, {
        headers: {
          Authorization: `Bearer ${token}`, // Add the Bearer token
          'Content-Type': 'application/json',
        },
      });

      setMessage(`Student with email ${email} removed successfully`);
      setEmail('');
      setConfirmDelete(false);
    } catch (error) {
      setError(error.response?.data.message || 'An error occurred while removing the student');
    }
  };

  return (
    <div className="manage-student-remove">
      <h2>Remove Student</h2>

      {/* Input for Email */}
      <input
        type="email"
        placeholder="Enter Student Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={error ? 'error' : ''}
      />

      {/* Delete Button */}
      {!confirmDelete ? (
        <div className="student-actions">
          <button className="delete-btn" onClick={() => setConfirmDelete(true)} disabled={!email}>
            Delete Student
          </button>
        </div>
      ) : (
        <div className="confirm-delete">
          <p>Are you sure you want to delete the student with email {email}?</p>
          <button className="confirm-btn" onClick={handleRemove}>Yes, Delete</button>
          <button className="cancel-btn" onClick={() => setConfirmDelete(false)}>Cancel</button>
        </div>
      )}

      {/* Error message */}
      {error && <div className="error">{error}</div>}

      {/* Success message */}
      {message && <div className="success">{message}</div>}
    </div>
  );
};

export default RemoveStudent;
