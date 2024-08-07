import React from 'react';

type FirstNameInputProps = {
  firstName: string;
  setFirstName: (firstName: string) => void;
};

const FirstNameInput: React.FC<FirstNameInputProps> = ({ firstName, setFirstName }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (inputValue.length <= 50) {
      setFirstName(inputValue);
    }
    // Optionally, you can add a feedback message or prevent further input when exceeding the limit.
    // For simplicity, this example allows up to 100 characters silently.
  };

  return (
    <input
      type="text"
      value={firstName}
      onChange={handleChange}
      placeholder="Prénom"
      style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ddd" }}
    />
  );
};

export default FirstNameInput;
