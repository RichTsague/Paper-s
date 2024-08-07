"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/config/firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import EleveProtectedRoute from "@/components/EleveProtectedRoute";

interface Carte {
  id: string;
  titre: string;
  places_restantes: number;
}

const MesCartes: React.FC = () => {
  const [cartes, setCartes] = useState<Carte[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCartes = async () => {
      setLoading(true);
      setError(null);

      try {
        const user = auth.currentUser;
        if (user) {
          const cartesQuery = query(
            collection(db, "cartes"),
            where("id_users", "==", user.uid),
            where("places_restantes", ">", 0)
          );
          const querySnapshot = await getDocs(cartesQuery);
          const cartesList: Carte[] = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Carte[];

          setCartes(cartesList);
        } else {
          setError("Utilisateur non connecté");
          router.push("/auth/login");
        }
      } catch (err) {
        setError("Erreur lors de la récupération des cartes");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchCartes();
      } else {
        setError("Utilisateur non connecté");
        router.push("/auth/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

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
        <h1 className="text-2xl m-4 font-bold">Mes Cartes</h1>
        {cartes.length > 0 ? (
          <ul className="md:grid md:grid-cols-2 md:gap-4 w-full max-w-3xl mx-auto">
            {cartes.map((carte) => (
              <li
                key={carte.id}
                className="bg-c0 border border-c4 p-4 mb-2 rounded-lg shadow-lg"
              >
                <h2 className="text-xl font-bold">{carte.titre}</h2>
                <p>Places restantes: {carte.places_restantes}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center mb-8">Aucune carte trouvée</p>
        )}
      </div>
    </EleveProtectedRoute>
  );
};

export default MesCartes;
