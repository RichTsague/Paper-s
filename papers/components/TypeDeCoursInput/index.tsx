import React from "react";
import { Label, Select } from "flowbite-react";

interface TypeDeCoursInputProps {
  typeDeCours: string;
  setTypeDeCours: (typeDeCours: string) => void;
}

const TypeDeCoursInput: React.FC<TypeDeCoursInputProps> = ({
  typeDeCours,
  setTypeDeCours,
}) => {
  return (
    <div>
      <Label htmlFor="typeDeCours">Type de Cours</Label>
      <Select
        id="typeDeCours"
        value={typeDeCours}
        onChange={(e) => setTypeDeCours(e.target.value)}
        // className="border-gray-300 rounded mt-1 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      >
        <option value="">Sélectionnez un type</option>
        <option value="Ballet classique">Ballet classique</option>
        <option value="Breakdance">Breakdance</option>
        <option value="Contemporain">Contemporain</option>
        <option value="Danse africaine">Danse africaine</option>
        <option value="Danse Bollywood">Danse Bollywood</option>
        <option value="Danse de salon">Danse de salon</option>
        <option value="Danse folklorique">Danse folklorique</option>
        <option value="Danse irlandaise">Danse irlandaise</option>
        <option value="Danse jazz">Danse jazz</option>
        <option value="Danse moderne">Danse moderne</option>
        <option value="Danse orientale">Danse orientale</option>
        <option value="Flamenco">Flamenco</option>
        <option value="Hip-Hop">Hip-Hop</option>
        <option value="Pole dance">Pole dance</option>
        <option value="Rumba">Rumba</option>
        <option value="Salsa">Salsa</option>
        <option value="Samba">Samba</option>
        <option value="Tango">Tango</option>
        <option value="Valse">Valse</option>
        <option value="Zumba">Zumba</option>
        {/* Ajoutez d'autres options ici */}
      </Select>
    </div>
  );
};

export default TypeDeCoursInput;
