"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebase-config";
import SidebarAdmin from "@/components/SidebarAdmin";
import AdminProtectedRoute from "@/components/AdminProtectedRoute";

const EditTarifPage: React.FC = () => {
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [prix, setPrix] = useState("");
  const [credit, setCredit] = useState<number>(0);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    const fetchTarif = async () => {
      try {
        const docRef = doc(db, "tarifs", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const tarifData = docSnap.data();
          setTitre(tarifData.titre);
          setDescription(tarifData.description);
          setImage(tarifData.image);
          setPrix(tarifData.prix);
          setCredit(tarifData.credit);
        } else {
          setError("Tarif introuvable");
        }
      } catch (err) {
        setError("Erreur lors de la récupération du tarif");
        console.error(err);
      }
    };

    fetchTarif();
  }, [id]);

  const handleSubmit = async () => {
    try {
      const docRef = doc(db, "tarifs", id);
      await updateDoc(docRef, {
        titre,
        description,
        image,
        prix: parseFloat(prix),
        credit,
      });
      setMessage("Tarif mis à jour avec succès");
      setTimeout(() => {
        router.push("/tarifs_admin");
      }, 2000);
    } catch (err) {
      setError("Erreur lors de la mise à jour du tarif");
      console.error(err);
    }
  };

  return (
    <AdminProtectedRoute>
      <div className="flex flex-col items-center w-full">
        <SidebarAdmin />
        {message && <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-4">{message}</div>}
        {error && <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-4">{error}</div>}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="w-full max-w-lg p-4"
        >
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="titre">
              Titre
            </label>
            <input
              id="titre"
              type="text"
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
              Image
            </label>
            <input
              id="image"
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="prix">
              Prix
            </label>
            <input
              id="prix"
              type="text"
              value={prix}
              onChange={(e) => setPrix(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="credit">
              Crédit
            </label>
            <input
              id="credit"
              type="number"
              value={credit}
              onChange={(e) => setCredit(parseInt(e.target.value))}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Mettre à jour
            </button>
          </div>
        </form>
      </div>
    </AdminProtectedRoute>
  );
};

export default EditTarifPage;
