"use client";
import React, { useEffect, useState } from "react";
import { collection, query, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/config/firebase-config";
import TableSkeleton from "../TableSkeleton";
import BoutonSuppression from "../BoutonSupression";

interface Rates {
  id: string;
  credit: number;
  description: string;
  image: string;
  lienPaiement: string;
  prix: number;
  titre: string;
}

const RatesTable: React.FC = () => {
  const [rates, setRates] = useState<Rates[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRates = async () => {
      setLoading(true);
      setError(null);

      try {
        const q = query(collection(db, "tarifs"));
        const querySnapshot = await getDocs(q);
        const ratesList: Rates[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          credit: doc.data().credit,
          description: doc.data().description,
          image: doc.data().image,
          lienPaiement: doc.data().lienPaiement,
          prix: doc.data().prix,
          titre: doc.data().titre,
        }));
        setRates(ratesList);
      } catch (err) {
        setError("Erreur lors de la récupération des tarifs");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, []);

  const handleDeleteRate = async (rateId: string) => {
    try {
      await deleteDoc(doc(db, "tarifs", rateId));
      setRates(rates.filter((rate) => rate.id !== rateId));
      // Vous pouvez ajouter un message de succès si nécessaire
    } catch (error) {
      setError("Erreur lors de la suppression du tarif");
      console.error(error);
    }
  };

  if (loading) {
    return <TableSkeleton />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center w-full">{error}</div>
    );
  }

  return (
    <div className=" overflow-x-auto max-h-screen  max-lg:md:max-w-md max-md:sm:max-w-xs ">
      <table className="min-w-full bg-white rounded-lg shadow-md overflow-auto">
        <thead>
          <tr className=" bg-gray-100">
            <th className="py-2 px-4 border-b text-center">Titre</th>
            <th className="py-2 px-4 border-b text-center">Description</th>
            <th className="py-2 px-4 border-b text-center">Prix</th>
            <th className="py-2 px-4 border-b text-center">Lien de Paiement</th>
            <th className="py-2 px-4 border-b text-center">Actions</th>{" "}
            {/* Nouvelle colonne pour les actions */}
          </tr>
        </thead>
        <tbody>
          {rates.map((rate) => (
            <tr key={rate.id}>
              <td className="py-2 px-4 border-b text-center">{rate.titre}</td>
              <td className="py-2 px-4 border-b text-center">
                {rate.description}
              </td>
              <td className="py-2 px-4 border-b text-center">{rate.prix} €</td>
              <td className="py-2 px-4 border-b text-center">
                <a
                  href={rate.lienPaiement}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Payer
                </a>
              </td>
              <td className="py-2 px-4 border-b text-center">
                <BoutonSuppression onDelete={() => handleDeleteRate(rate.id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RatesTable;
