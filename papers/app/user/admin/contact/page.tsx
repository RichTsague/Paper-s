"use client";

import React, { useState } from "react";
import AdminProtectedRoute from "@/components/AdminProtectedRoute";
type ContactInfo = {
  email: string;
  facebook: string;
  facebookLogo: string;
  instagram: string;
  instagramLogo: string;
};

const Contact: React.FC = () => {
  const [contactInfo] = useState<ContactInfo>({
    email: "thedancelab.contact@gmail.com",
    facebook: "https://www.facebook.com/profile.php?id=100093814275981",
    facebookLogo:
      "https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg",
    instagram: "https://www.instagram.com/thedancelab_lille/?hl=fr",
    instagramLogo:
      "https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png",
  });

  return (
    <AdminProtectedRoute>
      <div className="flex flex-col items-center justify-center w-full p-2">
        <div className="w-full max-w-md p-8 bg-white rounded shadow-md">
          <h2 className="text-3xl font-bold mb-6 text-center">
            Contactez-nous
          </h2>
          {contactInfo ? (
            <>
              <div className="mb-4">
                <h3 className="text-xl font-semibold">Adresse e-mail</h3>
                <p className="text-gray-700">
                  <span className="email">
                    <a href="thedancelab.contact@gmail.com">
                      {contactInfo.email}
                    </a>
                  </span>
                </p>
              </div>
              <div className="mb-4">
                <h3 className="text-xl font-semibold">Facebook</h3>
                <a
                  href={contactInfo.facebook}
                  className="text-blue-500"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={contactInfo.facebookLogo}
                    alt="Facebook"
                    className="w-6 h-6 inline-block"
                  />
                </a>
              </div>
              <div className="mb-4">
                <h3 className="text-xl font-semibold">Instagram</h3>
                <a
                  href={contactInfo.instagram}
                  className="text-pink-500"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={contactInfo.instagramLogo}
                    alt="Instagram"
                    className="w-6 h-6 inline-block"
                  />
                </a>
              </div>
            </>
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

export default Contact;
