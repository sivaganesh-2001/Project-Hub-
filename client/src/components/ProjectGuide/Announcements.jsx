import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/ProjectGuide/Announcements.css';

const Announcement = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [activeRole, setActiveRole] = useState('');
  const [batchCode, setBatchCode] = useState('');
  const [groupIds, setGroupIds] = useState([]);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [roles, setRoles] = useState([]);
  const [batchCodes, setBatchCodes] = useState([]);
  const [groups, setGroups] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/faculty/getRoles', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setRoles(response.data.roles);
      } catch (err) {
        setError('Error fetching roles');
      }
    };

    fetchRoles();
  }, [token]);

  useEffect(() => {
    const fetchBatchCodes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/faculty/getBatchCodes', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setBatchCodes(response.data.batchCodes);
      } catch (err) {
        setError('Error fetching batch codes');
      }
    };

    const fetchGroups = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/faculty/getGroups', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setGroups(response.data.studentDetails);
      } catch (err) {
        setError('Error fetching groups');
      }
    };

    if (activeRole === 'projectIncharge' || activeRole === 'hod') {
      fetchBatchCodes();
    } else if (activeRole === 'projectGuide') {
      fetchGroups();
    }
  }, [activeRole, token]);

const handleSubmit = async (e) => {
  e.preventDefault();

  if ((activeRole === 'projectGuide' || activeRole === 'projectIncharge') && groupIds.length === 0) {
    setError('Please select at least one group.');
    setMessage('');
    return;
  }

  const announcementData = new FormData();
  announcementData.append('title', title);
  announcementData.append('content', content);
  announcementData.append('activeRole', activeRole);

  if (activeRole === 'projectGuide' || activeRole === 'projectIncharge') {
    groupIds.forEach(groupId => announcementData.append('groupIds[]', groupId));
  } else {
    announcementData.append('batchCode', batchCode);
  }

  if (file) {
    announcementData.append('file', file);
  }

  try {
    const response = await axios.post('http://localhost:5000/api/faculty/postAnnouncement', announcementData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    setMessage('Announcement posted successfully!');
    setError('');
    setTimeout(() => setMessage(''), 10000);
    resetForm();
  } catch (err) {
    setError(err.response?.data?.message || 'Error posting announcement');
    setMessage('');
    setTimeout(() => setError(''), 10000);
  }
};

  const resetForm = () => {
    setTitle('');
    setContent('');
    setActiveRole('');
    setBatchCode('');
    setGroupIds([]);
    setFile(null);
  };

  return (
    <div className="announcement-form-container">
      <h2>Post Announcement</h2>
      <form onSubmit={handleSubmit} className="announcement-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="4"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="role">Role</label>
          <select
            id="role"
            value={activeRole}
            onChange={(e) => {
              setActiveRole(e.target.value);
              setBatchCode('');
              setGroupIds([]);
            }}
            required
          >
            <option value="">Select Role</option>
            {roles.map((role, index) => (
              <option key={index} value={role}>
                {role.charAt(0).toUpperCase() + role.slice(1).replace(/([A-Z])/g, ' $1')}
              </option>
            ))}
          </select>
        </div>

        {(activeRole === 'projectIncharge' || activeRole === 'hod') && (
          <div className="form-group">
            <label htmlFor="batchCode">Batch Code</label>
            <select
              id="batchCode"
              value={batchCode}
              onChange={(e) => setBatchCode(e.target.value)}
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
        )}

        {activeRole === 'projectGuide' && (
          <div className="form-group">
            <label>Group Selection (for Project Guide)</label>
            <div className="checkbox-group">
              {groups.map((group, index) => (
                <div key={index} className="group-container">
                  <div
                    className="checkbox-label"
                    onClick={() => {
                      const selectedId = group.groupId;
                      setGroupIds(prev =>
                        prev.includes(selectedId)
                          ? prev.filter(id => id !== selectedId)
                          : [...prev, selectedId]
                      );
                    }}
                    style={{ cursor: 'pointer' }} // Make it clear that the group ID is clickable
                  >
                    <input
                      type="checkbox"
                      id={`group-${group.groupId}`}
                      checked={groupIds.includes(group.groupId)}
                      readOnly // Prevent direct checkbox interaction
                    />
                    <span style={{ marginLeft: '5px' }}>{`Group ID: ${group.groupId}`}</span>
                  </div>
                  <div>
                    {/* <strong>Batch Code: {group.batchCode}</strong> */}
                  </div>
                  <div>
                    <strong>Students:</strong>
                    <ul>
                      {group.students.map((student, studentIndex) => (
                        <li key={studentIndex}>
                          {student.rollNo} - {student.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="file">Upload File</label>
          <input
            type="file"
            id="file"
            onChange={(e) => setFile(e.target.files[0])}
            accept=".jpg, .jpeg, .png, .pdf, .doc, .docx"
          />
        </div>

        <button type="submit" className="btn">Post Announcement</button>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default Announcement;
