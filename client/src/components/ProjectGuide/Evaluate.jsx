import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/ProjectIncharge/evaluate.css';

const Evaluate = ({ facultyId }) => {
    const [evaluations, setEvaluations] = useState([{ rollNo: '', groupId: '', marks: '' }]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChange = (index, event) => {
        const { name, value } = event.target;
        const newEvaluations = [...evaluations];
        newEvaluations[index][name] = value;
        setEvaluations(newEvaluations);
    };

    const handleAddEvaluation = () => {
        setEvaluations([...evaluations, { rollNo: '', groupId: '', marks: '' }]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const response = await axios.post('/api/evaluate-marks', { facultyId, evaluations });
            setMessage(response.data.message);
            setEvaluations([{ rollNo: '', groupId: '', marks: '' }]); // Reset the form
        } catch (err) {
            setError(err.response.data.message || 'An error occurred');
        }
    };

    return (
        <div className="evaluate-marks-container">
            <h2>Evaluate Student Marks</h2>
            <form onSubmit={handleSubmit}>
                {evaluations.map((evaluation, index) => (
                    <div key={index} className="form-group">
                        <label>Roll No:</label>
                        <input
                            type="text"
                            name="rollNo"
                            value={evaluation.rollNo}
                            onChange={(e) => handleChange(index, e)}
                            required
                        />
                        <label>Group ID:</label>
                        <input
                            type="text"
                            name="groupId"
                            value={evaluation.groupId}
                            onChange={(e) => handleChange(index, e)}
                            required
                        />
                        <label>Marks:</label>
                        <input
                            type="number"
                            name="marks"
                            value={evaluation.marks}
                            onChange={(e) => handleChange(index, e)}
                            required
                        />
                    </div>
                ))}
                <div className="button-group">
                    <button type="button" className="btn add-btn" onClick={handleAddEvaluation}>Add +</button>
                    <button type="submit" className="btn submit-btn">Submit</button>
                </div>
                {message && <p className="success-message">{message}</p>}
                {error && <p className="error-message">{error}</p>}
            </form>
        </div>
    );
};

export default Evaluate;
