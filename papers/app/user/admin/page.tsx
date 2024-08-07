"use client";

import React, { useEffect, useState } from "react";
import SidebarEleve, { SidebarAdmin } from "@/components/SidebarAdmin";
import { auth, db } from "@/config/firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const PannelAdmin: React.FC = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [userFirstName, setUserFirstName] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log("User data retrieved:", userData);
            setUserName(userData.name);
            setUserFirstName(userData.firstName);
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error getting user document:", error);
        }
      } else {
        console.log("User not logged in or no user found");
        setUserName(null);
        setUserFirstName(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div
      className="flex justify-center items-center w-full bg-cover bg-right bg-no-repeat max-sm:h-full"
      style={{
        backgroundImage: `url('https://thedancelab.fr/wp-content/uploads/2024/03/dz.png')`,
      }}
    >
      <div className="max-w-3xl p-8 rounded-lg shadow-lg text-center text-white">
        <h1 className="text-3xl font-bold mb-4">Bonjour {userFirstName}</h1>
      </div>
    </div>
  );
};

export default PannelAdmin;
