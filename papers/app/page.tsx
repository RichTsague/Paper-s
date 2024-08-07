"use client";
import React from "react";

const Home: React.FC = () => {
  return (
    <div
      className="flex justify-center items-center w-full bg-cover bg-right bg-no-repeat"
      style={{
        backgroundImage: `url('https://thedancelab.fr/wp-content/uploads/2024/03/dz.png')`,
      }}
    >
      <div className="max-w-3xl p-8 rounded-lg shadow-lg text-center text-white">
        <h1 className="text-3xl font-bold mb-4">THE DANCE LAB</h1>
        <p className="mb-4">
          Bienvenue chez votre référence bachata sur Lille ! Plongez dans
          l’univers envoûtant de cette danse avec nous. Notre école de danse
          offre un cadre chaleureux et convivial pour tous les niveaux,
          débutants aux confirmés.
        </p>
        <p className="mb-4">
          Nos professeurs passionnés vous aideront à perfectionner votre
          technique à travers des cours adaptés à chacun. Rejoignez également
          nos soirées dansantes pour pratiquer et partager des moments magiques
          avec d’autres passionnés.
        </p>
      </div>
    </div>
  );
};

export default Home;
