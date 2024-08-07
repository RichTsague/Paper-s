import React from 'react';

type DialogueBoxInputProps = {
  DialogueBox: string;
  setDialogueBox: (DialogueBox: string) => void;
};

const DialogueBoxInput: React.FC<DialogueBoxInputProps> = ({ DialogueBox, setDialogueBox }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (inputValue.length <= 1000) {
      setDialogueBox(inputValue);
    }
    // Optionally, you can add a feedback message or prevent further input when exceeding the limit.
    // For simplicity, this example allows up to 1000 characters silently.
  };

  return (
    <input
      type="text"
      value={DialogueBox}
      onChange={handleChange}
      placeholder="Description"
      style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ddd" }}
    />
  );
};

export default DialogueBoxInput;
