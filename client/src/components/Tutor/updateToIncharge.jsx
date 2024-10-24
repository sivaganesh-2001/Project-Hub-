import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/Tutor/updateToIncharge.css';

const UpdateToIncharge = () => {
  const [email, setEmail] = useState('');
  const [deptId, setDeptId] = useState('');
  const [batchCode, setBatchCode] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(''); // State for handling errors
  const [loading, setLoading] = useState(false); // State for handling loading

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');  // Reset message
    setError('');    // Reset error
    setLoading(true); // Set loading state

    try {
      const response = await axios.put('http://localhost:5000/api/faculty/updateToIncharge', {
        email,
        newRole: 'projectIncharge',
        deptId,
        batchCode,
      });

      setMessage(response.data.message); // Set success message
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred.');
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="update-to-incharge">
      <h2>Update Faculty to Project Incharge</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading} // Disable input during loading
          />
        </div>
        <div className="form-group">
          <label htmlFor="deptId">Department ID:</label>
          <input
            type="text"
            id="deptId"
            value={deptId}
            onChange={(e) => setDeptId(e.target.value)}
            required
            disabled={loading} // Disable input during loading
          />
        </div>
        <div className="form-group">
          <label htmlFor="batchCode">Batch Code:</label>
          <input
            type="text"
            id="batchCode"
            value={batchCode}
            onChange={(e) => setBatchCode(e.target.value)}
            required
            disabled={loading} // Disable input during loading
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update Role'}
        </button>
      </form>

      {/* Show message or error */}
      {message && <p className="message success">{message}</p>}
      {error && <p className="message error">{error}</p>}
    </div>
  );
};

export default UpdateToIncharge;
