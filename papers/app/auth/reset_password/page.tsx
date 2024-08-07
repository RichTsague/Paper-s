"use client";

import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/config/firebase-config"; // Assurez-vous que cette importation est correcte

const ResetPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Email de réinitialisation envoyé avec succès !");
    } catch (error: any) {
      setError(`Erreur lors de l'envoi de l'email de réinitialisation: ${error.message}`);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen w-full">
      <div className="max-w-sm w-full p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-center text-2xl mb-6">Réinitialiser le mot de passe</h1>

        <form onSubmit={handleResetPassword} className="flex flex-col gap-5">
          <div className='grid'>
            <label>Adresse email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          {message && <p className="text-green-500">{message}</p>}
          <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded">
            Envoyer l'email de réinitialisation
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
