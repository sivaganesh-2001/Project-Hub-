// src/components/FormInput.jsx
import React from 'react';
import '../../styles/Login/FormInput.css';

const FormInput = ({ label, type, value, onChange }) => {
  return (
    <div className="form-input">
      <label>{label}</label>
      <input type={type} value={value} onChange={onChange} />
    </div>
  );
};

export default FormInput;
