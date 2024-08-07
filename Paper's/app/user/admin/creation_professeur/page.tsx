"use client";

import React, { useState } from "react";
import Modal from "react-modal";
import { useRouter } from "next/navigation";
import NameInput from "@/components/NameInput";
import EmailInput from "@/components/EmailInput";
import PasswordInput from "@/components/PasswordInput";
import ValidationButton from "@/components/ValidationButton";
import FirstNameInput from "@/components/FirstNameInput";
import DescriptionInput from "@/components/DescriptionInput";
import { Label, FileInput, Checkbox, TextInput } from "flowbite-react";
import { auth, db, storage } from "@/config/firebase-config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import AdminProtectedRoute from "@/components/AdminProtectedRoute";

const CreateUserForm: React.FC = () => {
  const [name, setName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [bio, setBio] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const router = useRouter();

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+\@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePassword = (password: string) => {
    const re = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
    return re.test(password);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name || !firstName || !email || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Email invalide");
      return;
    }

    if (!validatePassword(password)) {
      setError(
        "Le mot de passe doit contenir au moins 6 caractères, une majuscule et un chiffre"
      );
      return;
    }

    setError("");
    setMessage("");
    setModalIsOpen(true); // Ouvrir la modale pour demander le mot de passe administrateur
  };

  const handleAdminPasswordSubmit = async () => {
    try {
      const admin = auth.currentUser; // Sauvegarder l'utilisateur admin actuel
      let adminEmail = "";

      if (admin) {
        adminEmail = admin.email || "";
      } else {
        setError("Aucun utilisateur connecté");
        return;
      }

      // Valider les informations de l'administrateur actuel
      await signInWithEmailAndPassword(auth, adminEmail, adminPassword);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Télécharger la photo de profil sur Firebase Storage
      let photoURL = "";
      if (photo) {
        const storageRef = ref(storage, `profile_pictures/${user.uid}`);
        await uploadBytes(storageRef, photo);
        photoURL = await getDownloadURL(storageRef);
      }

      // Ajouter les informations utilisateur à Firestore avec le statut "professeur"
      await setDoc(doc(db, "users", user.uid), {
        name: name,
        firstName: firstName,
        email: email,
        status: "professeur",
        photoURL: photoURL,
        bio: bio,
      });

      setMessage(`Utilisateur créé : ${user.email}`);
      setName("");
      setFirstName("");
      setEmail("");
      setPassword("");
      setPhoto(null);
      setBio("");
      setAdminPassword("");
      setModalIsOpen(false); // Fermer la modale

      // Reconnecter l'administrateur
      await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        setError("Cet utilisateur existe déjà");
      } else {
        setError(
          `Erreur lors de la création de l'utilisateur: ${error.message}`
        );
      }
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      width: "300px", // Ajustez la largeur de la modale
      padding: "20px", // Ajustez le padding pour rendre l'apparence plus compacte
    },
  };

  return (
    <AdminProtectedRoute>
      <div
        id="creationprof"
        className="flex justify-center items-center w-full p-2"
      >
        <div className="max-w-lg w-full p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-center  font-semibold text-2xl mb-6">
            Créer un Professeur
          </h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <NameInput name={name} setName={setName} />
            <FirstNameInput firstName={firstName} setFirstName={setFirstName} />
            <EmailInput email={email} setEmail={setEmail} />
            <PasswordInput password={password} setPassword={setPassword} />
            <div id="fileUpload" className="max-w-md">
              <div className="mb-2 block">
                <Label htmlFor="file" value="Photo" />
              </div>
              <FileInput
                id="file"
                onChange={handlePhotoChange}
                helperText="A profile picture is useful to confirm your are logged into your account"
              />
            </div>
            <DescriptionInput description={bio} setDescription={setBio} />
            {error && <p className="text-red-500">{error}</p>}
            {message && <p className="text-green-500">{message}</p>}
            <ValidationButton text="Créer un compte" />
          </form>
        </div>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={() => setModalIsOpen(false)}
          style={customStyles}
          contentLabel="Validation Administrateur"
          ariaHideApp={false} // Ajoutez ceci pour éviter les avertissements si vous n'avez pas configuré react-modal pour cacher l'application principale
        >
          <h2 className="text-xl mb-4">
            Valider avec mot de passe administrateur
          </h2>
          <input
            type="password"
            placeholder="Mot de passe administrateur"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />
          <button
            onClick={handleAdminPasswordSubmit}
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            Valider
          </button>
        </Modal>
      </div>
    </AdminProtectedRoute>
  );
};

export default CreateUserForm;
