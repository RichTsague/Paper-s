"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/config/firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
  doc,
  deleteDoc,
} from "firebase/firestore";
import BoutonSuppression from "@/components/BoutonSupression";
import EleveProtectedRoute from "@/components/EleveProtectedRoute";

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

const MesCours: React.FC = () => {
  const [myCours, setMyCours] = useState<Cours[]>([]);
  const [viewingCours, setViewingCours] = useState<Cours | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCours = async () => {
      setLoading(true);
      setError(null);

      try {
        const user = auth.currentUser;
        if (user) {
          const participationQuery = query(
            collection(db, "participation"),
            where("id_users", "==", user.uid)
          );
          const participationSnapshot = await getDocs(participationQuery);
          const myCoursIds = participationSnapshot.docs.map(
            (doc) => doc.data().id_cours
          );

          const coursSnapshot = await getDocs(collection(db, "cours"));
          const allCours = coursSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            date_heure_debut: (doc.data().date_heure_debut as Timestamp)
              .toDate()
              .toISOString(),
          })) as Cours[];

          const currentDateTime = new Date().toISOString();

          const sortedCours = allCours
            .filter((cours) => cours.date_heure_debut > currentDateTime)
            .sort(
              (a, b) =>
                new Date(a.date_heure_debut).getTime() -
                new Date(b.date_heure_debut).getTime()
            );

          const myCoursList = sortedCours.filter((cours) =>
            myCoursIds.includes(cours.id)
          );

          setMyCours(myCoursList);
        } else {
          setError("Utilisateur non connecté");
          router.push("/auth/login");
        }
      } catch (err) {
        setError("Erreur lors de la récupération des cours");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchCours();
      } else {
        setError("Utilisateur non connecté");
        router.push("/auth/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleViewClick = (cours: Cours) => {
    setViewingCours(cours);
  };

  const handleDesinscrireClick = async (coursId: string) => {
    const confirmed = window.confirm(
      "Êtes-vous sûr de vouloir vous désinscrire de ce cours ?"
    );
    if (confirmed) {
      try {
        const user = auth.currentUser;
        if (user) {
          const participationQuery = query(
            collection(db, "participation"),
            where("id_users", "==", user.uid),
            where("id_cours", "==", coursId)
          );
          const participationSnapshot = await getDocs(participationQuery);
          if (!participationSnapshot.empty) {
            const participationDoc = participationSnapshot.docs[0];
            await deleteDoc(doc(db, "participation", participationDoc.id));
            setMyCours(myCours.filter((cours) => cours.id !== coursId));
          }
        }
      } catch (err) {
        console.error("Erreur lors de la désinscription au cours : ", err);
        setError("Erreur lors de la désinscription au cours");
      }
    }
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
    <EleveProtectedRoute>
      <div className="flex flex-col items-center w-full p-3">
        <h1 className="text-2xl m-4 font-bold">Mes Cours</h1>
        {myCours.length > 0 ? (
          <ul className="md:grid md:grid-cols-2 md:gap-4 w-full max-w-3xl mx-auto text-center">
            {myCours.map((cours) => (
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
                <div className="flex justify-center mt-4">
                  <button
                    onClick={() => handleViewClick(cours)}
                    className="bg-blue-500 text-white p-2 rounded mr-2"
                  >
                    Visualiser
                  </button>
                  <BoutonSuppression
                    onDelete={() => handleDesinscrireClick(cours.id)}
                  >
                    Se désinscrire
                  </BoutonSuppression>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center mb-8">Aucun cours trouvé</p>
        )}

        {viewingCours && (
          <div className="fixed z-20 top-24 start-0 end-0 bottom-0 bg-gray-600 bg-opacity-50 flex justify-center items-center overflow-auto p-5">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full max-h-full overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">{viewingCours.titre}</h2>
              {viewingCours.photo && (
                <img
                  src={viewingCours.photo}
                  // alt={viewingCours.titre}
                  className="mb-4 w-full"
                />
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
    </EleveProtectedRoute>
  );
};

export default MesCours;
