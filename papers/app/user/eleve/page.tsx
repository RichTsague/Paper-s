"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/config/firebase-config"; // Assurez-vous que cette importation est correcte
import { onAuthStateChanged } from "firebase/auth";
import {
  query,
  where,
  collection,
  getDocs,
  doc,
  getDoc,
  Timestamp,
} from "firebase/firestore";
import EleveProtectedRoute from "@/components/EleveProtectedRoute";

interface Cours {
  id: string;
  titre: string;
  type: string;
  date_heure_debut: string;
  duree: {
    heures: number;
    minutes: number;
  };
  nom_professeur: string;
}

const PanelEleve: React.FC = () => {
  const [placeRestante, setPlaceRestante] = useState<number | null>(null);
  const [myCours, setMyCours] = useState<Cours[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPlaceRestante = async (userId: string) => {
      const carteQuery = query(
        collection(db, "cartes"),
        where("id_users", "==", userId)
      );
      const querySnapshot = await getDocs(carteQuery);
      if (!querySnapshot.empty) {
        const carteData = querySnapshot.docs[0].data();
        setPlaceRestante(carteData.places_restantes);
      } else {
        console.error("Aucune carte trouvée pour cet utilisateur");
      }
    };

    const fetchCours = async (userId: string) => {
      const participationQuery = query(
        collection(db, "participation"),
        where("id_users", "==", userId)
      );
      const participationSnapshot = await getDocs(participationQuery);
      const myCoursIds = participationSnapshot.docs.map(
        (doc) => doc.data().id_cours
      );

      const coursPromises = myCoursIds.map(async (coursId: string) => {
        const coursDoc = await getDoc(doc(db, "cours", coursId));
        if (coursDoc.exists()) {
          const coursData = coursDoc.data();

          return {
            id: coursDoc.id,
            titre: coursData.titre,
            type: coursData.type,
            date_heure_debut: (coursData.date_heure_debut as Timestamp)
              .toDate()
              .toLocaleString(),
            duree: {
              heures: coursData.duree.heures,
              minutes: coursData.duree.minutes,
            },
            nom_professeur: coursData.nom_professeur,
          } as Cours;
        } else {
          console.error("No such document!");
          return null;
        }
      });

      const cours = await Promise.all(coursPromises);
      setMyCours(cours.filter((c) => c !== null) as Cours[]);
    };

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setLoading(true);
        try {
          await fetchPlaceRestante(user.uid);
          await fetchCours(user.uid);
        } catch (err) {
          setError("Erreur lors de la récupération des données");
          console.error(err);
        } finally {
          setLoading(false);
        }
      } else {
        router.push("/auth/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
        Chargement...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
        {error}
      </div>
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
                <p>Date: {cours.date_heure_debut}</p>
                <p>
                  Durée: {cours.duree.heures}h {cours.duree.minutes}m
                </p>
                <p>Professeur: {cours.nom_professeur}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center">Aucun cours trouvé</p>
        )}
      </div>
    </EleveProtectedRoute>
  );
};

export default PanelEleve;
