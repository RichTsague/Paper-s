// components/ProfessorProtectedRoute.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { auth, db } from "@/config/firebase-config";

const ProfessorProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isProfessor, setIsProfessor] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkUserStatus = async () => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          const userData = userDoc.data();
          if (userData) {
            if (userData.status === "professeur") {
              setIsProfessor(true);
            } else if (userData.status === "admin") {
              router.push("/user/admin"); // Rediriger vers une page admin
            } else if (userData.status === "eleve") {
              router.push("/user/eleve"); // Rediriger vers une page d'élève
            } else {
              router.push("/access-denied"); // Rediriger vers une page d'accès refusé
            }
          }
        } else {
          router.push("/auth/login"); // Rediriger vers la page de login
        }
        setLoading(false);
      });
    };

    checkUserStatus();
  }, [router]);

  if (loading) {
    return <div>Chargement...</div>; // Vous pouvez personnaliser le chargement
  }

  return isProfessor ? <>{children}</> : null;
};

export default ProfessorProtectedRoute;
