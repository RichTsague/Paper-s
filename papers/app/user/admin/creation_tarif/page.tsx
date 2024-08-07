"use client";

import React, { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, auth } from "@/config/firebase-config";
import CreationTarif from "@/components/CreationTarif";
import AdminProtectedRoute from "@/components/AdminProtectedRoute";

const storage = getStorage();

const CreateTarifPage: React.FC = () => {
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [prix, setPrix] = useState<number>(0);
  const [credit, setCredit] = useState<number>(0);
  const [lienPaiement, setLienPaiement] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        setError("User not logged in");
        return;
      }

      let imageUrl = "";
      if (image) {
        const imageRef = ref(storage, `images/${image.name}`);
        await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(imageRef);
      }

      await addDoc(collection(db, "tarifs"), {
        titre,
        description,
        image: imageUrl,
        prix,
        credit,
        lienPaiement,
      });

      setMessage("Tarif créé avec succès");
      setTitre("");
      setDescription("");
      setImage(null);
      setPrix(0);
      setCredit(0);
      setLienPaiement("");
    } catch (err) {
      setError("Erreur lors de la création du tarif");
      console.error(err);
    }
  };

  return (
    <AdminProtectedRoute>
      <div className="flex justify-center items-center w-full p-2">
        {message && (
          <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-4">
            {message}
          </div>
        )}
        {error && (
          <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}
        <CreationTarif
          titre={titre}
          setTitre={setTitre}
          description={description}
          setDescription={setDescription}
          image={image}
          setImage={setImage}
          prix={prix}
          setPrix={setPrix}
          credit={credit}
          setCredit={setCredit}
          lienPaiement={lienPaiement}
          setLienPaiement={setLienPaiement}
          handleSubmit={handleSubmit}
        />
      </div>
    </AdminProtectedRoute>
  );
};

export default CreateTarifPage;
