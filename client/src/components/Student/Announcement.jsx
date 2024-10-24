import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/Student/Announcement.css'; // Ensure this CSS file exists for styling

const Announcements = ({ batchCode }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedAttachment, setSelectedAttachment] = useState(null); // New state for selected attachment

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/student/getAnnouncement', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Include the token for authorization
        },
      });

      setAnnouncements(response.data.announcements || []); // Ensure we set an empty array if no announcements
    } catch (error) {
      setMessage(error.response?.data?.message || 'An error occurred while fetching announcements.');
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  useEffect(() => {
    fetchAnnouncements(); // Fetch announcements when the component mounts
  }, []);

  const handleAttachmentClick = (attachment) => {
    setSelectedAttachment(attachment); // Set the selected attachment to be viewed
  };

  const closeViewer = () => {
    setSelectedAttachment(null); // Close the viewer
  };

  return (
    <div className="announcements-container">
      <h2></h2>
      {loading ? (
        <p>Loading announcements...</p>
      ) : (
        <>
          {message && <p className="message error">{message}</p>}
          {announcements.length > 0 ? (
            <ul className="announcement-list">
              {announcements.map((announcement) => (
                <li key={announcement._id} className="announcement-item">
                  <div className="announcement-box">
                    <h3>{announcement.title}</h3>
                    <p>{announcement.content}</p>

                    {/* Attachments Section */}
                    {/* Attachments Section */}
                    {announcement.attachments && announcement.attachments.length > 0 && (
                  <div className="attachments">
                    <h4>Attachments:</h4>
                    <ul>
                      {announcement.attachments.map((attachment, index) => (
                        <li key={index}>
                          <a
                              href={`http://localhost:5000/${attachment}`} // Append uploads folder correctly
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: 'blue', textDecoration: 'underline' }}
                            >
                              {attachment}
                            </a>

                        </li>
                      ))}
                    </ul>
                  </div>
                      )}

                    <p className="posted-info">
                      Posted by: <span className="role">{announcement.postedByRole}</span> on{' '}
                      {new Date(announcement.postedDate).toLocaleDateString()}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No announcements found for your batch.</p>
          )}
        </>
      )}

      {/* PDF Viewer */}
      {selectedAttachment && (
        <div className="pdf-viewer">
          <button onClick={closeViewer} style={{ marginBottom: '10px' }}>
            Close Viewer
          </button>
          <iframe
            src={selectedAttachment}
            width="100%"
            height="600px"
            title="PDF Viewer"
            style={{ border: 'none' }}
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default Announcements;
