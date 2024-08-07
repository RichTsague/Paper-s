"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import NameInput from "@/components/NameInput";
import EmailInput from "@/components/EmailInput";
import PasswordInput from "@/components/PasswordInput";
import ValidationButton from "@/components/ValidationButton";
import FirstNameInput from "@/components/FirstNameInput";
import { auth, db } from "@/config/firebase-config"; // Importation de la config Firebase
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const CreateUserForm: React.FC = () => {
  const [name, setName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState(""); // Pour afficher les messages de succès
  const router = useRouter();

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+\@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePassword = (password: string) => {
    const re = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
    return re.test(password);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Ajouter les informations utilisateur à Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: name,
        firstName: firstName,
        email: email,
        status: "eleve",
      });

      setMessage(`Utilisateur créé : ${user.email}`);
      setName("");
      setFirstName("");
      setEmail("");
      setPassword("");

      // Rediriger vers la page de l'élève
      router.push("/user/eleve");
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

  return (
    <div className="flex justify-center items-center w-full p-2">
      <div className="max-w-sm w-full p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-center text-2xl mb-6">Créer un compte</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <NameInput name={name} setName={setName} />
          <FirstNameInput firstName={firstName} setFirstName={setFirstName} />
          <EmailInput email={email} setEmail={setEmail} />
          <PasswordInput password={password} setPassword={setPassword} />
          {error && <p className="text-red-500">{error}</p>}
          {message && <p className="text-green-500">{message}</p>}
          <ValidationButton text="Créer un compte" />
          <a className="text-sm  underline text-center" href="/auth/login">
            Se connecter
          </a>
        </form>
      </div>
    </div>
  );
};

export default CreateUserForm;
