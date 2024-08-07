"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/config/firebase-config";
import SidebarAdmin from "@/components/SidebarAdmin";
import { useRouter } from "next/navigation";
import ProfessorProtectedRoute from "@/components/ProfessorProtectedRoute";

interface Tarif {
  id: string;
  titre: string;
  description: string;
  image: string;
  prix: number;
  credit: number;
}

const TarifsAdmin: React.FC = () => {
  const [tarifs, setTarifs] = useState<Tarif[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchTarifs = async () => {
      setLoading(true);
      setError(null);

      try {
        const querySnapshot = await getDocs(collection(db, "tarifs"));
        const tarifsList: Tarif[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Tarif[];
        setTarifs(tarifsList);
      } catch (err) {
        setError("Erreur lors de la récupération des tarifs");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTarifs();
  }, []);

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
    <ProfessorProtectedRoute>
      <div className="flex flex-col items-center w-full">
        <h1 className="text-2xl mb-4">Gestion des Tarifs</h1>
        {tarifs.length > 0 ? (
          <ul className="md:grid md:grid-cols-2 md:gap-4 w-full max-w-3xl mx-auto">
            {tarifs.map((tarif) => (
              <li
                key={tarif.id}
                className="bg-c0 border border-c4 p-4 mb-2 rounded-lg shadow-lg"
              >
                <h2 className="text-xl font-bold">{tarif.titre}</h2>
                <img
                  src={tarif.image}
                  alt={tarif.titre}
                  className="mb-4 w-full"
                  style={{ width: "150px", height: "auto" }}
                />
                <p>{tarif.description}</p>
                <p>Prix: {tarif.prix} €</p>
                <p>Crédit: {tarif.credit}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center">Aucun tarif trouvé</p>
        )}
      </div>
    </ProfessorProtectedRoute>
  );
};

export default TarifsAdmin;
