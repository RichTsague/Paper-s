import React from 'react';

type NameInputProps = {
  name: string;
  setName: (name: string) => void;
};

const NameInput: React.FC<NameInputProps> = ({ name, setName }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (inputValue.length <= 50) {
      setName(inputValue);
    }
    // Optionally, you can add a feedback message or prevent further input when exceeding the limit.
    // For simplicity, this example allows up to 100 characters silently.
  };

  return (
    <input
      type="text"
      value={name}
      onChange={handleChange}
      placeholder="Nom"
      style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ddd" }}
    />
  );
};

export default NameInput;
