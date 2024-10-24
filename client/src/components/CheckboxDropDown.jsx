import React, { useState } from 'react';
import '../styles/CheckBoxDropDown.css'; // Add styles for the dropdown

const CheckboxDropdown = ({ options, selectedOptions, setSelectedOptions, label }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionChange = (option) => {
    const updatedOptions = selectedOptions.includes(option)
      ? selectedOptions.filter((o) => o !== option)
      : [...selectedOptions, option];
    setSelectedOptions(updatedOptions);
  };

  return (
    <div className="checkbox-dropdown">
      <label>{label}</label>
      <div className="dropdown" onClick={() => setIsOpen(!isOpen)}>
        <div className="dropdown-label">
          {selectedOptions.length > 0
            ? selectedOptions.join(', ')
            : 'Select options'}
        </div>
        <div className={`dropdown-list ${isOpen ? 'open' : ''}`}>
          {options.map((option, index) => (
            <label key={index} className="dropdown-option">
              <input
                type="checkbox"
                checked={selectedOptions.includes(option)}
                onChange={() => handleOptionChange(option)}
              />
              {option}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CheckboxDropdown;
