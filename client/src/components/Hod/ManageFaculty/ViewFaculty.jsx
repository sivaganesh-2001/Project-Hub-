import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../../styles/Admin/ViewFaculty.css';

const SearchFaculty = () => {
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [faculties, setFaculties] = useState([]);
  const [filteredFaculties, setFilteredFaculties] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Fetch all faculties when the component mounts
  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/faculty/getDeptFaculty', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        setFaculties(response.data.faculties);
        setFilteredFaculties(response.data.faculties);
      } catch (error) {
        console.error('Error fetching faculties:', error);
        setError('Error fetching faculties.');
      }
    };

    fetchFaculties();
  }, []);

  // Handle search by registration number
  const handleSearch = () => {
    setMessage('');
    setError('');

    if (!registrationNumber) {
      setError('Registration number is required');
      return;
    }

    const filtered = faculties.filter(faculty =>
      faculty.registrationNumber.toLowerCase().includes(registrationNumber.toLowerCase())
    );

    if (filtered.length > 0) {
      setFilteredFaculties(filtered);
      setMessage('Faculty details fetched successfully.');
    } else {
      setError('No faculty found with the given registration number.');
      setFilteredFaculties([]);
    }
  };

  return (
    <div className="search-faculty-container">
      {/* Search Bar at the top */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search Faculty by Registration No"
          value={registrationNumber}
          onChange={(e) => setRegistrationNumber(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}

      {/* Display the list of faculties in a table */}
      <table className="faculty-table">
        <thead>
          <tr>
            <th>Register No</th>
            <th>Name</th>
            <th>Email</th>
            <th>Department ID</th>
          </tr>
        </thead>
        <tbody>
          {filteredFaculties.length > 0 ? (
            filteredFaculties.map(faculty => (
              <tr key={faculty._id}>
                <td>{faculty.registrationNumber || 'N/A'}</td>
                <td>{faculty.name || 'N/A'}</td>
                <td>{faculty.email || 'N/A'}</td>
                <td>{faculty.departmentIds.join(', ') || 'N/A'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No faculties found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SearchFaculty;
