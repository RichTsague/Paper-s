"use client";

import AdminProtectedRoute from "@/components/AdminProtectedRoute";
import React, { useEffect, useState } from "react";

type ContactInfo = {
  phoneNumber: string;
  email: string;
  facebook: string;
  instagram: string;
};

const modifier_contact: React.FC = () => {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const response = await fetch("/api/contact");
        const data = await response.json();
        setContactInfo(data);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des informations de contact:",
          error
        );
      }
    };

    fetchContactInfo();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContactInfo((prevInfo) => ({
      ...prevInfo!,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/contact", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactInfo),
      });

      if (response.ok) {
        alert("Informations de contact mises à jour avec succès !");
      } else {
        alert("Erreur lors de la mise à jour des informations de contact.");
      }
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour des informations de contact:",
        error
      );
    }
  };

  return (
    <AdminProtectedRoute>
      <div className="flex justify-center items-center w-full p-2">
        <div className="w-full max-w-md p-8 bg-white rounded shadow-md">
          <h2 className="text-3xl font-bold mb-6 text-center">
            Modifier les informations de contact
          </h2>
          {contactInfo ? (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="phoneNumber"
                  className="block text-lg font-semibold"
                >
                  Numéro de téléphone
                </label>
                <input
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={contactInfo.phoneNumber}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-lg font-semibold">
                  Adresse e-mail
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={contactInfo.email}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="facebook"
                  className="block text-lg font-semibold"
                >
                  Facebook
                </label>
                <input
                  type="text"
                  id="facebook"
                  name="facebook"
                  value={contactInfo.facebook}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="instagram"
                  className="block text-lg font-semibold"
                >
                  Instagram
                </label>
                <input
                  type="text"
                  id="instagram"
                  name="instagram"
                  value={contactInfo.instagram}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <button
                type="submit"
                className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-700"
              >
                Mettre à jour
              </button>
            </form>
          ) : (
            <p className="text-center font-bold">
              Chargement des informations...
            </p>
          )}
        </div>
      </div>
    </AdminProtectedRoute>
  );
};

export default modifier_contact;
