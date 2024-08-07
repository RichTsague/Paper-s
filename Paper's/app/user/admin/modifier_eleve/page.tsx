"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Label, Select } from "flowbite-react";
import NameInput from "@/components/NameInput";
import FirstNameInput from "@/components/FirstNameInput";
import DialogueBoxInput from "@/components/DialogueBoxInput";
import ValidationButton from "@/components/ValidationButton";
import { auth, db } from "@/config/firebase-config";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import AdminProtectedRoute from "@/components/AdminProtectedRoute";

const ModifierEleve: React.FC = () => {
  const [eleves, setEleves] = useState<any[]>([]);
  const [selectedEleveId, setSelectedEleveId] = useState("");
  const [name, setName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [bio, setBio] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchEleves = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const eleveList = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((eleve) => eleve.status === "eleve");
        setEleves(eleveList);
      } catch (error) {
        console.error("Erreur lors de la récupération des élèves:", error);
      }
    };

    fetchEleves();
  }, []);

  useEffect(() => {
    const selectedEleve = eleves.find((eleve) => eleve.id === selectedEleveId);
    if (selectedEleve) {
      setName(selectedEleve.name);
      setFirstName(selectedEleve.firstName);
      setBio(selectedEleve.bio);
    }
  }, [selectedEleveId, eleves]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name || !firstName) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    setError("");
    setMessage("");

    try {
      const updates: any = {
        name: name,
        firstName: firstName,
        bio: bio,
      };

      const docRef = doc(db, "users", selectedEleveId);
      await updateDoc(docRef, updates);

      setMessage(`Informations mises à jour pour ${firstName} ${name}`);
    } catch (error: any) {
      setError(
        `Erreur lors de la mise à jour des informations: ${error.message}`
      );
    }
  };

  const handleDelete = async () => {
    if (!selectedEleveId) {
      setError("Veuillez sélectionner un élève à supprimer.");
      return;
    }

    setError("");
    setMessage("");

    try {
      // Supprimer l'utilisateur de Firestore
      const docRef = doc(db, "users", selectedEleveId);
      await deleteDoc(docRef);

      // Mettre à jour l'état pour retirer l'élève supprimé de la liste
      setEleves(eleves.filter((eleve) => eleve.id !== selectedEleveId));
      setSelectedEleveId("");
      setName("");
      setFirstName("");
      setBio("");

      setMessage("Élève supprimé avec succès.");
    } catch (error: any) {
      setError(`Erreur lors de la suppression de l'élève: ${error.message}`);
    }
  };

  return (
    <AdminProtectedRoute>
      <div className="flex justify-center items-center w-full p-2">
        <div className="max-w-lg w-full p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-center font-semibold  text-2xl mb-6">
            Modifier un compte élève
          </h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <Label htmlFor="eleve-select" value="Sélectionnez un élève" />
              <Select
                id="eleve-select"
                required
                value={selectedEleveId}
                onChange={(e) => setSelectedEleveId(e.target.value)}
              >
                <option value="">Sélectionner un élève</option>
                {eleves.map((eleve) => (
                  <option key={eleve.id} value={eleve.id}>
                    {eleve.firstName} {eleve.name}
                  </option>
                ))}
              </Select>
            </div>
            <NameInput name={name} setName={setName} />
            <FirstNameInput firstName={firstName} setFirstName={setFirstName} />
            <DialogueBoxInput DialogueBox={bio} setDialogueBox={setBio} />
            {error && <p className="text-red-500">{error}</p>}
            {message && <p className="text-green-500">{message}</p>}
            <ValidationButton text="Mettre à jour" />
            <button
              type="button"
              className="bg-c6 hover:bg-c7 text-white font-bold py-2 px-4 rounded min-w-full"
              onClick={handleDelete}
            >
              Supprimer élève
            </button>
          </form>
        </div>
      </div>
    </AdminProtectedRoute>
  );
};

export default ModifierEleve;
