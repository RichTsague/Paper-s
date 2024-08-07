import React from "react";

type DescriptionInputProps = {
  description: string;
  setDescription: (description: string) => void;
};

const DescriptionInput: React.FC<DescriptionInputProps> = ({
  description,
  setDescription,
}) => {
  const maxLength = 1000; // Définition de la limite maximale de caractères

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setDescription(value);
    }
    // Vous pouvez ajouter ici une indication ou un message d'erreur si la limite est dépassée
  };

  const remainingCharacters = description.length;

  return (
    <div className="relative">
      <textarea
        value={description}
        onChange={handleChange}
        placeholder="Description"
        className="w-full px-3 py-2 border rounded"
        rows={4}
        maxLength={maxLength}
      />
      <div className="absolute bottom-2 right-2 text-sm text-gray-500">
        {remainingCharacters} /1000
      </div>
    </div>
  );
};

export default DescriptionInput;
