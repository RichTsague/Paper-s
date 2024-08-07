"use client";
import React, { useEffect, useState } from "react";
import { db, storage } from "@/config/firebase-config";
import {
  collection,
  getDocs,
  Timestamp,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import BoutonSuppression from "@/components/BoutonSupression";
import AdminProtectedRoute from "@/components/AdminProtectedRoute";

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

const PannelAdmin: React.FC = () => {
  const [cours, setCours] = useState<Cours[]>([]);
  const [editingCours, setEditingCours] = useState<Cours | null>(null);
  const [viewingCours, setViewingCours] = useState<Cours | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [newPhoto, setNewPhoto] = useState<File | null>(null);

  useEffect(() => {
    const fetchCours = async () => {
      setLoading(true);
      setError(null);

      try {
        const coursSnapshot = await getDocs(collection(db, "cours"));
        const allCours = coursSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          date_heure_debut: (doc.data().date_heure_debut as Timestamp)
            .toDate()
            .toLocaleString(),
        })) as Cours[];

        setCours(allCours);
      } catch (err) {
        setError("Erreur lors de la récupération des cours");
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

  const handleEditClick = (cours: Cours) => {
    setEditingCours(cours);
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (editingCours) {
      const { name, value } = e.target;
      if (name === "duree.heures" || name === "duree.minutes") {
        setEditingCours({
          ...editingCours,
          duree: {
            ...editingCours.duree,
            [name.split(".")[1]]: parseInt(value),
          },
        });
      } else {
        setEditingCours({ ...editingCours, [name]: value });
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewPhoto(e.target.files[0]);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingCours) return;

    try {
      let photoURL = editingCours.photo;

      if (newPhoto) {
        const photoRef = ref(storage, `photos/${newPhoto.name}`);
        await uploadBytes(photoRef, newPhoto);
        photoURL = await getDownloadURL(photoRef);
      }

      const coursRef = doc(db, "cours", editingCours.id);
      await updateDoc(coursRef, {
        titre: editingCours.titre,
        description: editingCours.description,
        type: editingCours.type,
        nom_professeur: editingCours.nom_professeur,
        date_heure_debut: Timestamp.fromDate(
          new Date(editingCours.date_heure_debut)
        ),
        duree: editingCours.duree,
        photo: photoURL,
      });

      setMessage("Cours mis à jour avec succès");
      setEditingCours(null);
      setNewPhoto(null);
      setCours(
        cours.map((c) =>
          c.id === editingCours.id ? { ...editingCours, photo: photoURL } : c
        )
      );
    } catch (error) {
      setError("Erreur lors de la mise à jour du cours");
      console.error(error);
    }
  };

  const handleDeleteClick = async (coursId: string) => {
    const confirmDelete = confirm(
      "Êtes-vous sûr de vouloir supprimer ce cours ?"
    );
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "cours", coursId));
      setCours(cours.filter((cours) => cours.id !== coursId));
      setMessage("Cours supprimé avec succès");
    } catch (error) {
      setError("Erreur lors de la suppression du cours");
      console.error(error);
    }
  };

  const formatDateToInputValue = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "";
    }
    return date.toISOString().substring(0, 16);
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
    <AdminProtectedRoute>
      <div className="flex flex-col items-center w-full p-3">
        {message && (
          <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-4">
            {message}
          </div>
        )}
        <h1 className="text-2xl m-4 font-bold">Gestion des Cours</h1>
        {cours.length > 0 ? (
          <ul className="md:grid md:grid-cols-2 md:gap-4 w-full max-w-3xl mx-auto text-center ">
            {cours.map((cours) => (
              <li
                key={cours.id}
                className="bg-c0 border border-c4 p-4 mb-2 rounded-lg shadow-lg relative"
              >
                <h2 className="text-xl font-bold">{cours.titre}</h2>
                <p>Type: {cours.type}</p>
                <p>Date: {cours.date_heure_debut}</p>
                <p>
                  Durée: {cours.duree.heures}h {cours.duree.minutes}m
                </p>
                <p>Professeur: {cours.nom_professeur}</p>
                <div className="flex flex-wrap justify-center mt-4 space-x-2 gap-1">
                  <button
                    onClick={() => handleViewClick(cours)}
                    className="bg-c8 text-white p-2 rounded-lg"
                  >
                    Visualiser
                  </button>
                  <button
                    onClick={() => handleEditClick(cours)}
                    className="bg-yellow-500 text-white p-2 rounded-lg "
                  >
                    Modifier
                  </button>
                  <BoutonSuppression
                    onDelete={() => handleDeleteClick(cours.id)}
                  />
                </div>
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
                <strong>Date:</strong> {viewingCours.date_heure_debut}
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
                  className="bg-c8 text-white p-2 rounded"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}

        {editingCours && (
          <div className="fixed z-20 top-24 start-0 end-0 bottom-0 bg-gray-600 bg-opacity-50 flex justify-center items-center overflow-auto p-5">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full max-h-full overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">Modifier le Cours</h2>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="titre"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Titre
                  </label>
                  <input
                    type="text"
                    name="titre"
                    value={editingCours.titre}
                    onChange={handleEditChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                  />
                </div>
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={editingCours.description}
                    onChange={handleEditChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                  />
                </div>
                <div>
                  <label
                    htmlFor="type"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Type
                  </label>
                  <input
                    type="text"
                    name="type"
                    value={editingCours.type}
                    onChange={handleEditChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                  />
                </div>
                <div>
                  <label
                    htmlFor="nom_professeur"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Nom du Professeur
                  </label>
                  <input
                    type="text"
                    name="nom_professeur"
                    value={editingCours.nom_professeur}
                    onChange={handleEditChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                  />
                </div>
                <div>
                  <label
                    htmlFor="date_heure_debut"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Date et Heure de Début
                  </label>
                  <input
                    type="datetime-local"
                    name="date_heure_debut"
                    value={formatDateToInputValue(
                      editingCours.date_heure_debut
                    )}
                    onChange={handleEditChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                  />
                </div>
                <div>
                  <label
                    htmlFor="duree_heures"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Durée (heures)
                  </label>
                  <input
                    type="number"
                    name="duree.heures"
                    value={editingCours.duree.heures}
                    onChange={(e) =>
                      setEditingCours({
                        ...editingCours,
                        duree: {
                          ...editingCours.duree,
                          heures: parseInt(e.target.value),
                        },
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                  />
                </div>
                <div>
                  <label
                    htmlFor="duree_minutes"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Durée (minutes)
                  </label>
                  <input
                    type="number"
                    name="duree.minutes"
                    value={editingCours.duree.minutes}
                    onChange={(e) =>
                      setEditingCours({
                        ...editingCours,
                        duree: {
                          ...editingCours.duree,
                          minutes: parseInt(e.target.value),
                        },
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                  />
                </div>
                <div>
                  <label
                    htmlFor="photo"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Photo (URL)
                  </label>
                  <input
                    type="file"
                    name="photo"
                    onChange={handleFileChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setEditingCours(null)}
                    className="bg-red-500 text-white p-2 rounded mr-2"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="bg-green-500 text-white p-2 rounded"
                  >
                    Enregistrer
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminProtectedRoute>
  );
};

export default PannelAdmin;
