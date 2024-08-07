"use client";
import React, { useEffect, useState } from "react";
import { collection, getDocs, Timestamp } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { db, storage } from "@/config/firebase-config";

interface Cours {
  id: string;
  titre: string;
  description: string;
  type: string;
  nom_professeur: string;
  date_heure_debut: string;
  duree: {
    heures: number;
    minutes: number;
  };
  photo: string;
}

const CoursEleve: React.FC = () => {
  const [availableCours, setAvailableCours] = useState<Cours[]>([]);
  const [viewingCours, setViewingCours] = useState<Cours | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCours = async () => {
      setLoading(true);
      setError(null);

      try {
        const coursSnapshot = await getDocs(collection(db, "cours"));
        const allCours = await Promise.all(
          coursSnapshot.docs.map(async (doc) => {
            const data = doc.data();
            let photoURL = "";
            try {
              photoURL = await getDownloadURL(
                ref(storage, `photos/${data.photo}`)
              );
            } catch (err) {
              console.error(
                `Erreur lors de la récupération de la photo: ${data.photo}`,
                err
              );
            }
            return {
              id: doc.id,
              ...data,
              date_heure_debut: (data.date_heure_debut as Timestamp)
                .toDate()
                .toISOString(),
              photo: photoURL,
            } as Cours;
          })
        );

        const currentDateTime = new Date().toISOString();

        const sortedCours = allCours
          .filter((cours) => cours.date_heure_debut > currentDateTime)
          .sort(
            (a, b) =>
              new Date(a.date_heure_debut).getTime() -
              new Date(b.date_heure_debut).getTime()
          );

        setAvailableCours(sortedCours);
      } catch (err) {
        setError("Erreur lors de la récupération des cours : " + err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCours();
  }, []);

  const handleViewClick = (cours: Cours) => {
    setViewingCours(cours);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full">
        Chargement...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center w-full">{error}</div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full p-3">
      <h1 className="text-2xl m-4 font-bold">Cours Disponibles</h1>
      {availableCours.length > 0 ? (
        <ul className="md:grid md:grid-cols-2 md:gap-4 w-full max-w-3xl mx-auto text-center">
          {availableCours.map((cours) => (
            <li
              key={cours.id}
              className="bg-c0 border border-c4 p-4 mb-2 rounded-lg shadow-lg"
            >
              <h2 className="text-xl font-bold">{cours.titre}</h2>
              <p>Type: {cours.type}</p>
              <p>Date: {new Date(cours.date_heure_debut).toLocaleString()}</p>
              <p>
                Durée: {cours.duree.heures}h {cours.duree.minutes}m
              </p>
              <p>Professeur: {cours.nom_professeur}</p>
              {cours.photo ? (
                <img
                  src={cours.photo}
                  alt={cours.titre}
                  className="mb-4 w-full"
                />
              ) : (
                <p className="mb-4">Aucune photo disponible</p>
              )}
              <button
                onClick={() => handleViewClick(cours)}
                className="bg-blue-500 text-white p-2 rounded mt-2"
              >
                Visualiser
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center">Aucun cours disponible</p>
      )}

      {viewingCours && (
        <div className="fixed z-20 top-24 start-0 end-0 bottom-0 bg-gray-600 bg-opacity-50 flex justify-center items-center overflow-auto p-5">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full max-h-full overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">{viewingCours.titre}</h2>
            {viewingCours.photo ? (
              <img
                src={viewingCours.photo}
                alt={viewingCours.titre}
                className="mb-4 w-full"
              />
            ) : (
              <p className="mb-4">Aucune photo disponible</p>
            )}
            <p className="mb-4">{viewingCours.description}</p>
            <p>
              <strong>Type:</strong> {viewingCours.type}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(viewingCours.date_heure_debut).toLocaleString()}
            </p>
            <p>
              <strong>Durée:</strong> {viewingCours.duree.heures}h{" "}
              {viewingCours.duree.minutes}m
            </p>
            <p>
              <strong>Professeur:</strong> {viewingCours.nom_professeur}
            </p>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setViewingCours(null)}
                className="bg-blue-500 text-white p-2 rounded"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursEleve;
