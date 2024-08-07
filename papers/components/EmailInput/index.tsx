import React from 'react';

type EmailInputProps = {
  email: string;
  setEmail: (email: string) => void;
};

const EmailInput: React.FC<EmailInputProps> = ({ email, setEmail }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (inputValue.length <= 100) {
      setEmail(inputValue);
    }
    // Optionally, you can add a feedback message or prevent further input when exceeding the limit.
    // For simplicity, this example allows up to 100 characters silently.
  };

  return (
    <input
      type="email"
      value={email}
      onChange={handleChange}
      placeholder="Email"
      style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ddd" }}
    />
  );
};

export default EmailInput;

