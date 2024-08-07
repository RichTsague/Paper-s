"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Label, Select, FileInput } from "flowbite-react";
import NameInput from "@/components/NameInput";
import ValidationButton from "@/components/ValidationButton";
import FirstNameInput from "@/components/FirstNameInput";
import DialogueBoxInput from "@/components/DialogueBoxInput";
import { auth, db, storage } from "@/config/firebase-config";
import {
  doc,
  getDocs,
  updateDoc,
  deleteDoc,
  collection,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import AdminProtectedRoute from "@/components/AdminProtectedRoute";

const ModifierProf: React.FC = () => {
  const [professors, setProfessors] = useState<any[]>([]);
  const [selectedProfessorId, setSelectedProfessorId] = useState("");
  const [name, setName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [bio, setBio] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchProfessors = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const professorList = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((prof) => prof.status === "professeur");
        setProfessors(professorList);
      } catch (error) {
        console.error("Erreur lors de la récupération des professeurs:", error);
      }
    };

    fetchProfessors();
  }, []);

  useEffect(() => {
    const selectedProfessor = professors.find(
      (prof) => prof.id === selectedProfessorId
    );
    if (selectedProfessor) {
      setName(selectedProfessor.name);
      setFirstName(selectedProfessor.firstName);
      setBio(selectedProfessor.bio);
    }
  }, [selectedProfessorId, professors]);

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

      if (photo) {
        const storageRef = ref(
          storage,
          `profile_pictures/${selectedProfessorId}`
        );
        await uploadBytes(storageRef, photo);
        const photoURL = await getDownloadURL(storageRef);
        updates.photoURL = photoURL;
      }

      const docRef = doc(db, "users", selectedProfessorId);
      await updateDoc(docRef, updates);

      setMessage(`Informations mises à jour pour ${firstName} ${name}`);
    } catch (error: any) {
      setError(
        `Erreur lors de la mise à jour des informations: ${error.message}`
      );
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const handleDelete = async () => {
    if (!selectedProfessorId) {
      setError("Veuillez sélectionner un professeur à supprimer.");
      return;
    }

    setError("");
    setMessage("");

    try {
      // Supprimer l'utilisateur de Firestore
      const docRef = doc(db, "users", selectedProfessorId);
      await deleteDoc(docRef);

      // Mettre à jour l'état pour retirer le professeur supprimé de la liste
      setProfessors(
        professors.filter((prof) => prof.id !== selectedProfessorId)
      );
      setSelectedProfessorId("");
      setName("");
      setFirstName("");
      setPhoto(null);
      setBio("");

      setMessage("Professeur supprimé avec succès.");
    } catch (error: any) {
      setError(`Erreur lors de la suppression du professeur: ${error.message}`);
    }
  };

  return (
    <AdminProtectedRoute>
      <div className="flex justify-center items-center w-full p-2">
        <div className="max-w-lg w-full p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-center  font-semibold text-2xl mb-6">
            Modifier un Professeur
          </h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <Label
                htmlFor="professor-select"
                value="Sélectionnez un professeur"
              />
              <Select
                id="professor-select"
                required
                value={selectedProfessorId}
                onChange={(e) => setSelectedProfessorId(e.target.value)}
              >
                <option value="">Sélectionner un professeur</option>
                {professors.map((prof) => (
                  <option key={prof.id} value={prof.id}>
                    {prof.firstName} {prof.name}
                  </option>
                ))}
              </Select>
            </div>
            <NameInput name={name} setName={setName} />
            <FirstNameInput firstName={firstName} setFirstName={setFirstName} />
            <div id="fileUpload" className="max-w-md">
              <div className="mb-2 block">
                <Label htmlFor="file" value="Photo" />
              </div>
              <FileInput
                id="file"
                onChange={handlePhotoChange}
                accept="image/*"
                helperText="A profile picture is useful to confirm your are logged into your account"
              />
            </div>
            <DialogueBoxInput DialogueBox={bio} setDialogueBox={setBio} />
            {error && <p className="text-red-500">{error}</p>}
            {message && <p className="text-green-500">{message}</p>}
            <ValidationButton text="Mettre à jour" />
            <button
              type="button"
              className=" bg-c6 hover:bg-c7 text-white font-bold py-2 px-4 rounded min-w-full"
              onClick={handleDelete}
            >
              Supprimer professeur
            </button>
          </form>
        </div>
      </div>
    </AdminProtectedRoute>
  );
};

export default ModifierProf;
