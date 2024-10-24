import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/ProjectIncharge/CreateGroup.css';

const CreateGroupForm = () => {
  const [batchCodes, setBatchCodes] = useState([]); // State for batch codes
  const [selectedBatchCode, setSelectedBatchCode] = useState(''); // Selected batch code
  const [projectGuideRegNo, setProjectGuideRegNo] = useState(''); // Project guide registration number
  const [ungroupedStudents, setUngroupedStudents] = useState([]); // State for ungrouped students
  const [selectedStudents, setSelectedStudents] = useState([]); // State for selected students
  const [message, setMessage] = useState(''); // Message for successful operations
  const [error, setError] = useState(''); // Error message

  const token = localStorage.getItem('token'); // Retrieve the token from localStorage

  // Fetch batch codes when the component mounts
  useEffect(() => {
    const fetchBatchCodes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/faculty/getBatchCodes', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBatchCodes(response.data.batchCodes);
      } catch (err) {
        setError('Error fetching batch codes');
      }
    };

    fetchBatchCodes();
  }, [token]);

  // Fetch ungrouped students when a batch code is selected
  useEffect(() => {
    const fetchUngroupedStudents = async () => {
      if (selectedBatchCode) {
        try {
          const response = await axios.post(
            'http://localhost:5000/api/faculty/retrieveUngroupedStudents', 
            { batchCode: selectedBatchCode },  // Sending batchCode in the body
            {
              headers: {
                Authorization: `Bearer ${token}`, // Attach the token in the headers
                'Content-Type': 'application/json' // Ensure JSON content type
              }
            }
          );
          setUngroupedStudents(response.data.ungroupedStudents); // Set the retrieved students
        } catch (err) {
          setError('Error fetching ungrouped students');
        }
      }
    };

    fetchUngroupedStudents();
  }, [selectedBatchCode, token]);

  const handleStudentSelection = (rollNo) => {
    setSelectedStudents((prev) =>
      prev.includes(rollNo)
        ? prev.filter((s) => s !== rollNo) // Deselect if already selected
        : [...prev, rollNo] // Select if not selected
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    // Validate inputs
    if (!selectedBatchCode.trim() || selectedStudents.length === 0) {
      setError('Batch code and selected students are required.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/faculty/createGroup', {
        batchCode: selectedBatchCode,
        projectGuideRegNo,
        studentRollNos: selectedStudents // Use selected students directly
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setMessage(response.data.message);
      setSelectedBatchCode(''); // Reset after successful submission
      setProjectGuideRegNo('');
      setSelectedStudents([]);
      setUngroupedStudents([]);
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating group');
    }
  };

  return (
    <div className="create-group-form">
      <h2>Create Group</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Batch Code:</label>
          <select
            value={selectedBatchCode}
            onChange={(e) => setSelectedBatchCode(e.target.value)}
            required
          >
            <option value="">Select Batch Code</option>
            {batchCodes.map((code, index) => (
              <option key={index} value={code}>
                {code}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Project Guide Registration Number:</label>
          <input
            type="text"
            value={projectGuideRegNo}
            onChange={(e) => setProjectGuideRegNo(e.target.value)}
          />
        </div>
        <div>
          <label>Ungrouped Students:</label>
          <table>
            <thead>
              <tr>
                <th>Select</th>
                <th>Roll Number</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {ungroupedStudents.map((student, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(student.rollNo)}
                      onChange={() => handleStudentSelection(student.rollNo)}
                    />
                  </td>
                  <td>{student.rollNo}</td>
                  <td>{student.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button type="submit">Create Group</button>
      </form>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default CreateGroupForm;
