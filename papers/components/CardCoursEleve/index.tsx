import React from "react";
import { Card } from "flowbite-react";

type CardImageProps = {
  titre: string;
  description: string;
  image?: string;
  prix: string;
  date: Date;
  heure: string;
  duree: string;
  videos: string[]; // Liste de liens vidéo
};

const CardcoursEleve: React.FC<CardImageProps> = ({
  titre,
  description,
  image,
  prix,
  date,
  heure,
  duree,
  videos,
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
        <p className="font-normal text-gray-700 dark:text-gray-400">{prix}</p>
        <p className="font-normal text-gray-700 dark:text-gray-400">
          Date: {date ? date.toLocaleDateString() : "Date non disponible"},
          Heure: {heure}, Durée: {duree}
        </p>
        {videos.length > 0 && (
          <div className="mt-4">
            <h6 className="text-lg font-semibold mb-2">Vidéos:</h6>
            <ul className="list-disc pl-6">
              {videos.map((video, index) => (
                <li key={index}>
                  <a href={video} target="_blank" rel="noopener noreferrer">{`Vidéo ${index + 1}`}</a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
};

export default CardcoursEleve;
