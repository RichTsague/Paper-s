import React, { ChangeEvent } from "react";

interface TitleInputProps {
  title: string;
  setTitle: (title: string) => void;
}

const TitleInput: React.FC<TitleInputProps> = ({ title, setTitle }) => {
  const maxLength = 1000;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setTitle(value);
    }
    // Vous pouvez ajouter ici une indication ou un message d'erreur si la limite est dépassée
  };

  return (
    <div>
      {/* <label
        htmlFor="title"
        className="block text-sm font-medium text-gray-700"
      >
        Titre
      </label> */}
      <textarea
        id="title"
        value={title}
        onChange={handleChange}
        placeholder="Titre"
        maxLength={100}
        className="w-full px-3 py-2 border rounded"
      />
    </div>
  );
};

export default TitleInput;
