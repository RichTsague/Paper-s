import React from "react";
import { Card } from "flowbite-react";

type CardImageProps = {
  titre: string;
  description: string;
  image?: string; // Image est maintenant optionnel
  date: Date;
  heure: string;
  duree: string;
  eleves: string[]; // Liste des élèves
  liens: string[]; // Liste de liens
};

const CardCoursProf: React.FC<CardImageProps> = ({
  titre,
  description,
  image,
  date,
  heure,
  duree,
  eleves,
  liens,
}) => {
  return (
    <Card className="max-w-sm m-4">
      {image && (
        <img className="w-full h-48 object-cover" src={image} alt={titre} />
      )}
      <div className="p-4">
        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {titre}
        </h5>
        <p className="font-normal text-gray-700 dark:text-gray-400">
          {description}
        </p>
        <p className="font-normal text-gray-700 dark:text-gray-400">
          Date: {date ? date.toLocaleDateString() : "Date non disponible"},
          Heure: {heure}, Durée: {duree}
        </p>
        <div className="mt-4">
          <h6 className="font-bold text-gray-700 dark:text-gray-400 mb-2">Liste des élèves :</h6>
          <ul>
            {eleves.map((eleve, index) => (
              <li key={index} className="text-gray-700 dark:text-gray-400">{eleve}</li>
            ))}
          </ul>
        </div>
        <div className="mt-4">
          <h6 className="font-bold text-gray-700 dark:text-gray-400 mb-2">Liens :</h6>
          <ul>
            {liens.map((lien, index) => (
              <li key={index} className="text-blue-500 hover:underline">{lien}</li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default CardCoursProf;
