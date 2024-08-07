import React from 'react';
import { Card } from "flowbite-react";

type CardTarifVisiteurProps = {
  titre: string;
  description: string;
  image?: string; // Image est maintenant optionnel
  prix: string;
};

const CardTarifVisiteur: React.FC<CardTarifVisiteurProps> = ({ titre, description, image, prix }) => {
  return (
    <Card className="max-w-sm m-4 sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl"> {/* Ajout de classes adaptatives */}
      {image && (
        <img
          className="w-full h-48 object-cover"
          src={image}
          alt={titre}
        />
      )}
      <div className="p-4">
        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {titre}
        </h5>
        <p className="font-normal text-gray-700 dark:text-gray-400">
          {description}
        </p>
        <p className="font-normal text-gray-700 dark:text-gray-400">
          {prix}
        </p>
      </div>
    </Card>
  );
}

export default CardTarifVisiteur;
